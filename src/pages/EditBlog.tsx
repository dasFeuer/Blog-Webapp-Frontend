import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, updateBlog } from "../services/api";
import { useAuth } from "../context/AuthContext";
import QuillWrapper from "../components/QuillWrapper";
import "react-quill/dist/quill.snow.css";

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("article");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blog = await getBlogById(Number(id));
        setTitle(blog.title);
        setContent(blog.content);
        setContentType(blog.contentType || "article");
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blog");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBlog(Number(id), { title, content, contentType });
      navigate(`/blogs/${id}`);
    } catch (err) {
      setError("Failed to update blog");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "code-block",
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>You must be logged in to edit a blog post.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="contentType" className="block mb-1">
            Content Type
          </label>
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="article">Article</option>
            <option value="code">Code</option>
          </select>
        </div>
        <div>
          <label htmlFor="content" className="block mb-1">
            Content
          </label>
          <QuillWrapper
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className={contentType === "code" ? "font-mono" : ""}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
}
