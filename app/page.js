"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import Link from "next/link";

export default function Home() {
	const [blogs, setBlogs] = useState([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [editModalIsOpen, setEditModalIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [image, setImage] = useState("");
	const [description, setDescription] = useState("");
	const [toUpdateTitle, settoUpdateTitle] = useState("");
	const [toUpdateImage, settoUpdateImage] = useState("");
	const [toUpdateDescription, settoUpdateDescription] = useState("");
	const [id, setIdToUpdate] = useState("");

	useEffect(() => {
		fetchBlogs();
	}, []);

	const fetchBlogs = async () => {
		try {
			const response = await axios.get("/api/blogs");
			setBlogs(response.data);
			console.log(response.data);
		} catch (error) {
			console.error("Error fetching blogs:", error);
		}
	};

	const createBlog = async () => {
		try {
			const response = await axios.post("/api/blogs", {
				title,
				image,
				description,
			});
			setBlogs([
				...blogs,
				{
					title,
					image,
					description,
				},
			]);
			closeModal();
		} catch (error) {
			console.error("Error creating blog:", error);
		}
	};
	const UpdateBlog = async () => {
		try {
			const response = await axios.put(`/api/blogs/${id}`, {
				title: toUpdateTitle,
				image: toUpdateImage,
				description: toUpdateDescription,
			});
			// Remove the previous blog post from the state blogs and update the new one
			setBlogs((prevBlogs) =>
				prevBlogs.map((blog) => {
					if (blog._id === id) {
						return {
							...blog,
							title: toUpdateTitle,
							image: toUpdateImage,
							description: toUpdateDescription,
						};
					}
					return blog;
				})
			);
			closeEditModal();
		} catch (error) {
			console.error("Error updating blog:", error);
		}
	};

	const deleteBlog = async (id) => {
		try {
			console.log("deleting  the msg with id", id);
			await axios.delete(`/api/blogs/${id}`);
			setBlogs(blogs.filter((blog) => blog._id !== id));
		} catch (error) {
			console.error("Error deleting blog:", error);
		}
	};

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
		setTitle("");
		setImage("");
		setDescription("");
	};
	const openEditModel = async (id) => {
		try {
			const response = await axios.get(`/api/blogs/${id}`);
			console.log(`Blog found with id ${id}:`, response.data);
			const { title, image, description } = response.data;
			settoUpdateTitle(title);
			settoUpdateImage(image);
			settoUpdateDescription(description);
			setIdToUpdate(id);
		} catch (error) {
			console.error(`Error getting blog with id ${id}:`, error);
			return null;
		}
		setEditModalIsOpen(true);
	};

	const closeEditModal = () => {
		setEditModalIsOpen(false);
		setTitle("");
		setImage("");
		setDescription("");
	};
	return (
		<div>
			<div className="flex flex-col">
				<navbar className="bg-blue-500 h-10 flex justify-between items-center">
					<h1 className="text-2xl px-2 py-2 text-white tracking-wide font-semibold">
						Blog Application
					</h1>
					<button
						onClick={openModal}
						className="text-white mr-10 hover:border-b-2 border-black text-lg  "
					>
						Create Blog
					</button>
				</navbar>

				<Modal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
					className="Modal flex  flex-col items-center mt-10"
				>
					<h2 className="text-xl font-bold mb-4">Create Blog</h2>
					<div className="flex flex-col">
						<input
							className="border border-gray-300 mb-2 p-2 w-[30rem]"
							type="text"
							placeholder="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
						<input
							className="border border-gray-300 mb-2 p-2  w-[30rem]"
							type="text"
							placeholder="Image URL"
							value={image}
							onChange={(e) => setImage(e.target.value)}
						/>
						<input
							className="border border-gray-300 mb-2 p-2  w-[30rem]"
							type="text"
							placeholder="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className="flex">
						<button
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
							onClick={createBlog}
						>
							Create
						</button>
						<button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							onClick={closeModal}
						>
							Cancel
						</button>
					</div>
				</Modal>

				<h1 className="text-2xl text-blue-600 font-extrabold pt-2 tracking-wider ml-10">
					All Blogs
				</h1>
				<div className="flex  gap-4 justify-start flex-wrap items-center">
					{blogs.map((blog) => (
						<div key={blog._id} className="mb-4 bg-gray-200 w-[25rem]  p-4">
							<Link href={`/blogs/${blog._id}`}>
								<h2 className="text-xl font-bold mb-2">{blog.title}</h2>
								<div>
									<img className="w-96" src={blog.image} alt={blog.image} />
									<p className="text-gray-600">{blog.description}</p>
								</div>
							</Link>
							<div className="space-x-4">
								<button
									className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
									onClick={() => deleteBlog(blog._id)}
								>
									Delete
								</button>
								<button
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
									onClick={() => openEditModel(blog._id)}
									// onClick={openModal}
								>
									Update
								</button>
							</div>
						</div>
					))}
				</div>
				<Modal
					isOpen={editModalIsOpen}
					onRequestClose={closeEditModal}
					className="Modal flex  flex-col items-center mt-10"
				>
					<h2 className="text-xl font-bold mb-4">Update Blog</h2>
					<div className="flex flex-col">
						<input
							className="border border-gray-300 mb-2 p-2 w-[30rem]"
							type="text"
							placeholder="Title"
							value={toUpdateTitle}
							onChange={(e) => settoUpdateTitle(e.target.value)}
						/>
						<input
							className="border border-gray-300 mb-2 p-2  w-[30rem]"
							type="text"
							placeholder="Image URL"
							value={toUpdateImage}
							onChange={(e) => settoUpdateImage(e.target.value)}
						/>
						<input
							className="border border-gray-300 mb-2 p-2  w-[30rem]"
							type="text"
							placeholder="Description"
							value={toUpdateDescription}
							onChange={(e) => settoUpdateDescription(e.target.value)}
						/>
					</div>
					<div className="flex">
						<button
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
							onClick={UpdateBlog}
						>
							Update
						</button>
						<button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							onClick={closeEditModal}
						>
							Cancel
						</button>
					</div>
				</Modal>
			</div>
		</div>
	);
}
