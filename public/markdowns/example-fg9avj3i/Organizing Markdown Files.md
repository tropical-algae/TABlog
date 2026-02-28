- created_time: 2026-2-28
- tags: example
- tags: case
- tags: image

---

All blog content in this project lives inside the `markdowns/` directory. There are two recommended organization strategies.

## Option 1: Flat Structure

```
markdowns/  
├── first-post.md  
├── second-post.md  
`── third-post.md
```

This works well for small projects with fewer articles.

## Option 2: Nested Structure

```
markdowns/  
├── tutorials/  
│   ├── docker-intro.md  
│   `── kubernetes-basics.md  
`── research/  
    `── distributed-systems.md
```

This approach scales better for large blogs.

## Using Relative Paths for Local Images

When inserting local images, always use relative paths **relative to the current Markdown file**.

For example, suppose this file is:

```
markdowns/guide/file-management.md
```

And the image is stored in:

```
markdowns/assets/file-tree.png
```

Then the correct reference would be:

```
![Project File Tree](../assets/file-tree.png)
```

Example rendering:

## Cloud Image Example

You can also insert remote images:

```
![image](https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80)
```

Example rendering:

![image](https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80)

## Recommended Practices

- Avoid absolute paths.
- Use meaningful file names.
- Keep folder depth logical and consistent.

With a clean structure and proper relative referencing, your Markdown blog remains portable and maintainable across different deployment environments.