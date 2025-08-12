# Everything Markdown - The Website

This repository contains the source code for the Website of Everything Markdown: a modern, fast, and SEO-friendly blog platform built with React, Vite, and TypeScript.
Everything Markdown is a collection of tools that works with the language humans and LLMs share: Markdown.

## Features

*   **Markdown-Powered Blog**: Articles are written in Markdown with frontmatter for metadata.
*   **Rich Content**: Supports images, Mermaid diagrams, and code highlighting.
*   **Dynamic Content**: The site automatically detects and builds new blog posts.
*   **Project Showcase**: A carousel to display projects.
*   **Filtering and Searching**: Users can filter blog posts by category and search for specific content.
*   **OpenTelemetry Integration**: Built-in tracing to monitor web performance.
*   **SEO Optimized**: Includes features like dynamic meta tags, canonical URLs, and JSON-LD structured data.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [npm](https://www.npmjs.com/) or a compatible package manager
*   [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/chgayot/everything-markdown-website.git
    cd everything-markdown-website
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your own values:

    ```env
    VITE_SITE_URL=http://localhost:5173
    VITE_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="https://your-otel-endpoint.com/v1/traces"
    VITE_SEO_TITLE="My Awesome Site"
    VITE_SEO_DESCRIPTION="A description of my awesome site."
    VITE_SEO_KEYWORDS="comma,separated,keywords"
    VITE_SEO_AUTHOR="Your Name"
    ```

    *   `VITE_SITE_URL`: The base URL of your site. For local development, this is typically `http://localhost:5173`.
    *   `VITE_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`: The endpoint for the OpenTelemetry collector.

    ### SEO Configuration

    These variables control the default SEO metadata for your site.

    *   `VITE_SEO_TITLE`: The default title for your site's pages.
    *   `VITE_SEO_DESCRIPTION`: The default meta description.
    *   `VITE_SEO_KEYWORDS`: A comma-separated list of keywords.
    *   `VITE_SEO_AUTHOR`: The default author for the site.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Publishing an Article

Creating and publishing a new article is straightforward.

1.  **Create a new Markdown file** inside the `src/content/blog/` directory.
2.  **(Optional) Organize Images:** To keep your article's images neatly organized, create a dedicated folder for them inside `public/blog-images/`. It's best practice to name this folder after your article's `slug`.
    *   For example, if your slug is `hello-world`, place your images in `public/blog-images/hello-world/`.
    *   Add them in the article with ![Iamge alt Text](/blog-images/hello-world/your-image.png)
3.  **Add frontmatter and content** to your file. Use the template below as a starting point or the _template.md file

### Article Template

```markdown
---
title: "Your Article Title"
slug: "your-unique-slug"
description: "A brief summary of your article for SEO purposes."
date: "2025-08-12"
category: "technology"
keywords:
  - react
  - typescript
  - webdev
coverImage: "/blog-images/your-image.png"
coverAlt: "A descriptive alt text for your image."
draft: false
---

# Your Article Heading

Your content starts here.

## Images

Images are served from the `public` directory. To link to an image you organized in the previous step, use a path relative to `public`.

![Alt Text](/blog-images/your-slug/your-image.png)

## Code Highlighting

Syntax highlighting is supported for various languages.

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

## Mermaid Diagrams

You can also include Mermaid diagrams to visualize data.

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
```

## Publishing Your Site

You can publish the site using either `npm` to build the static files or Docker to create a containerized version.

### Using npm

1.  **Build the site:**

    ```bash
    npm run build
    ```

    This command generates a `dist` directory with all the static assets for your site.

2.  **Deploy the `dist` directory** to your favorite static hosting provider (e.g., Vercel, Netlify, GitHub Pages).

### Using Docker

The project includes two Docker Compose files to simplify containerized deployments: `docker-compose.standalone.yml` for local testing and `docker-compose.traefik.yml` for use with a Traefik reverse proxy.

#### Standalone Deployment

This is the simplest way to run the blog in a container.

1.  **Build and run the container:**

    ```bash
    docker-compose -f docker-compose.standalone.yml up
    ```

2.  **Access the site:**

    Your site will be available at [http://localhost:8080](http://localhost:8080).

#### Deployment with Traefik

This setup is for users who run Traefik as a reverse proxy.

1.  **Review the configuration:**

    Open `docker-compose.traefik.yml` and review the `blog-with-traefik` service. The host rule is configured using the `SITE_URL` from your `.env` file.

    > **Note**: For Traefik, the `VITE_SITE_URL` should not include the `https://` protocol (e.g., `chgayot.com`, not `https://chgayot.com`).

2.  **Uncomment the service:**

    In `docker-compose.traefik.yml`, uncomment the `blog-with-traefik` service definition.

3.  **Deploy the service:**

    Ensure your Traefik stack is running and connected to the `traefik` external network. Then, deploy the blog service:

    ```bash
    docker-compose -f docker-compose.traefik.yml up -d
    ```

    Traefik will automatically detect the service, handle routing, and provision an SSL certificate.

#### Updating the Site with New Content

When you add a new article, you need to rebuild the Docker image to include the new content.

1.  **Add your new article** to the `src/content/blog/` directory.

2.  **Rebuild and restart your service:**

    ```bash
    # For standalone
    docker-compose -f docker-compose.standalone.yml up -d --build

    # For Traefik
    docker-compose -f docker-compose.traefik.yml up -d --build
    ```

    The `--build` flag tells Docker Compose to rebuild the image before starting the container.

## Contributing

Contributions are welcome! If you have a suggestion that would make this project better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
