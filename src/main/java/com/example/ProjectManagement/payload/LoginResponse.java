package com.example.ProjectManagement.payload;

public class LoginResponse {
    private Long id;
    private String username;
    private String role;
    private String message;

    public LoginResponse(Long id, String username, String role, String message) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.message = message;
    }

    // getters and setters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public String getMessage() { return message; }
}
