 # AgilAI Agent Sandbox

This repository is an automated workspace for the **AgilAI Multi-Agent Scrum Team**. 

## 🤖 Purpose
This project serves as a testing ground for autonomous AI agents (Scrum Master, Product Owner, Dev, Tech Lead, Tester) to demonstrate their software development lifecycle capabilities. 

The code in this repository—ranging from simple games to utility scripts—is generated, reviewed, and tested entirely by AI agents.

## 🛠️ How it Works
- **DevDan (Developer Agent)**: Clones this repo, implements features, and submits Pull Requests.
- **Tech Lead Agent**: Reviews and approves/merges PRs.
- **Tester Agent**: Validates changes before they are merged into `main`.

## ⚠️ Disclaimer
Content in this repository is **AI-generated**. It is intended for research and demonstration of multi-agent collaboration and may not be suitable for production use without human review.

## 📄 License
This project is licensed under the Apache License 2.0.

## Kids Calculator - Local Docker Deployment

To run the Kids Calculator locally using Docker, follow these steps:

1.  **Ensure Docker is Installed**: Make sure you have Docker installed on your system. You can download it from [docker.com](https://www.docker.com/get-started).

2.  **Navigate to the Project Directory**: Open your terminal or command prompt and navigate to the root directory of this project where the `Dockerfile` and web files (`index.html`, `style.css`, `script.js`) are located.

3.  **Build the Docker Image**: Run the following command to build the Docker image. This command tells Docker to build an image named `kids-calculator` using the `Dockerfile` in the current directory.
    ```bash
    docker build -t kids-calculator .
    ```

4.  **Run the Docker Container**: Once the image is built, you can run a container from it. The calculator will be served by Nginx inside the container, typically on port 80. You can map this to a port on your local machine (e.g., 8080) using the `-p` flag.
    ```bash
    docker run -p 8080:80 kids-calculator
    ```

5.  **Access the Calculator**: Open your web browser and go to `http://localhost:8080` to access the Kids Calculator.