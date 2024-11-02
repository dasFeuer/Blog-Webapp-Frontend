import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../services/api";
import { useAuth } from "../context/AuthContext";
import QuillWrapper from "../components/QuillWrapper";
import "react-quill/dist/quill.snow.css";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("article");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const quillRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to create a blog post.");
      return;
    }

    try {
      await createBlog({ title, content, contentType });
      navigate("/blogs");
    } catch (err) {
      setError("Failed to create blog");
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

  if (!user) return <div>You must be logged in to create a blog post.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Blog</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
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
            ref={quillRef}
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
          Create Blog
        </button>
      </form>
    </div>
  );
}