
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h> 
#include <arpa/inet.h> 
#include <unistd.h> 

void handle_get(FILE *fp, const char *path);
void handle_client(int client_fd, struct sockaddr_in *client_addr);

int main(int argc, char **argv)
{
    int server_fd;
    if ((server_fd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)) < 0) {
        perror("socket");
        exit(1);
    }

    int yes = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));

    struct sockaddr_in server_addr; 
    memset(&server_addr, 0, sizeof(server_addr)); 
    server_addr.sin_family = AF_INET; 
    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    server_addr.sin_port = htons(8000); 
    if (bind(server_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("bind");
        exit(1);
    }

    if (listen(server_fd, 5) < 0) {
        perror("listen");
        exit(1);
    }

    printf("open http://localhost:8000/ with your browser!\n");

    while (1) {
        int client_fd;
        struct sockaddr_in client_addr;
        socklen_t addr_length = sizeof client_addr;
        if ((client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &addr_length)) < 0) {
            perror("accept");
            exit(1);
        }
        handle_client(client_fd, &client_addr);
    }
}

void handle_client(int client_fd, struct sockaddr_in *client_addr)
{
    char ipstr[128];
    if (inet_ntop(AF_INET, &client_addr->sin_addr, ipstr, sizeof ipstr) == NULL) {
        perror("inet_ntop");
        return;
    }
    printf("Connection from %s has been established!\n", ipstr);

    FILE *fp = fdopen(client_fd, "r+");
    if (fp == NULL) {
        perror("fdopen");
        return;
    }

    const int MAX_HEADER_LINES = 256;
    char *headers[MAX_HEADER_LINES];
    int header_index = 0;

    while (1) {
        if (header_index >= MAX_HEADER_LINES) {
            puts("too many HTTP headers!");
            goto bailout;
        }
        char line[1024];
        if (fgets(line, sizeof line, fp) == NULL) {
            puts("connection closed!");
            goto bailout;
        }
        char *eol = strpbrk(line, "\r\n");
        if (eol) {
            *eol = '\0';
        }
        printf("Received: %s\n", line);

        headers[header_index++] = strdup(line);

        if (strcmp(line, "") == 0) {
            break;
        }
    }

    // "GET / HTTP/1.0"
    char *req_line = headers[0];
    char *req[] = { NULL, NULL, NULL };
    for (int i = 0; i < 3; i++) {
        char *word = strtok(req_line, " "); 
        req_line = NULL;
        req[i] = word;
        if (word == NULL) {
            break;
        }
    }
    if (req[2] == NULL) {
        printf("wrong format: %s\n", headers[0]);
        goto bailout;
    }
    const char *method = req[0];
    const char *path = req[1];
    const char *http_version = req[2];
    printf("method=%s, path=%s, http_version=%s\n", method, path, http_version);

    if (strcmp(method, "GET") == 0) {
        handle_get(fp, path);
    } else {
        printf("unsupported method: %s\n", method);
        fprintf(fp, "HTTP/1.0 501 Not Implemented\r\n");
    }
    bailout:
    fclose(fp);
    for (int i = 0; i < header_index; i++) {
        free(headers[i]);
    }
}

void handle_get(FILE *fp, const char *path)
{
    if (strcmp(path, "/") == 0) { // http://localhost:8000/ 
        fprintf(fp,
                "HTTP/1.0 200 OK\r\n"         
                "Content-Type: text/html\r\n" 
                "\r\n"                        
                "<!DOCTYPE html>\r\n"         
                "<html>\r\n"
                "<head><title>Sample</title></head>\r\n"
                "<body>This server is implemented in C!</body>\r\n"
                "</html>\r\n"
        );
    } else {    // (http://localhost:8000/index.html) 
        fprintf(fp,
                "HTTP/1.0 404 Not Found\r\n"  // 404 Not Found
                "Content-Type: text/html\r\n"
                "\r\n"
                "<!DOCTYPE html>\r\n"
                "<html>\r\n"
                "<head><title>404 Not Found</title></head>\r\n"
                "<body>%s is not found</body>\r\n"
                "</html>\r\n",
                path
        );
    }
    fflush(fp);
}
