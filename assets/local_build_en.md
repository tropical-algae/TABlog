
### ⚙️ Deployment Environment

This project is deployed using Docker. Please ensure the following tools are installed in your environment **before deployment**:

> ⚠️ The versions listed below are for reference only. Using versions that are too old may cause the build to fail.

- **Docker**: v27.0.2  
- **npm**: v10.5.2  
- **Node.js**: v20.13.1  

#### 1. Add .env

Refer to [.env.example](.env.example) and create your own .env file.
An example configuration is shown below:


| Name              | Description                          |
| ----------------- | ------------------------------------ |
| `VITE_SITE_TITLE` | The title of the website             |
| `VITE_WEB_PORT`   | The port used during development     |
| `IMAGE_NAME`      | The name of the Docker image         |
| `IMAGE_VERSION`   | The version of the Docker image      |
| `CONTAINER_PORT`  | The exposed port of the container    |
| `CONTAINER_MOUNT` | The directory mounted to the container |

#### 2. One-Click Build and Launch

Use the following commands to build the Docker image and run the container:

```bash
bash scripts/clean.sh   # Clear cache, images, and containers
bash scripts/build.sh   # Build and package the Docker image
bash scripts/run.sh     # Run the container
```
