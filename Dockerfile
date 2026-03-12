# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the working directory
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code into the working directory
COPY src/ .

# Define the command to run the application
# For Pygame, direct graphical output requires additional setup (e.g., X11 forwarding)
# This Dockerfile is set up for running the game's logic,
# but for visual play, consider your environment or headless testing.
CMD ["python", "main.py"]
