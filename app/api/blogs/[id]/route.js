import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri =
	"mongodb+srv://our-first-user:mPhci50hKVdoeuPy@cluster0.ftavg.mongodb.net/?retryWrites=true&w=majority";

const dbName = "myFirstDatabase";

export async function DELETE(request, { params }) {
	try {
		console.log("request params ", params);
		const { id } = params.id;
		console.log(params.id);
		console.log("Deleting that ");
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const collection = client.db(dbName).collection("blogPosts");
		// const toDelete = { _id: `ObjectId(${id})` };
		const toDelete = { _id: new ObjectId(params.id) };
		console.log("toDelete", toDelete);
		const result = await collection.deleteOne(toDelete);
		await client.close();
		console.log("Deletion Result ", result);
		return NextResponse.json(result);
	} catch (error) {
		console.error("Error deleting blog post:", error);
		return NextResponse.error(new Error("Failed to delete blog post"));
	}
}

export async function GET(request, { params }) {
	try {
		// const { id } = params.id;
		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const collection = client.db(dbName).collection("blogPosts");
		const blog = await collection.findOne({ _id: new ObjectId(params.id) });
		console.log(blog);
		await client.close();
		if (!blog) {
			return NextResponse.error(new Error("Failed to find blog post"));
		}
		return NextResponse.json({
			title: blog.title,
			description: blog.description,
			image: blog.image,
		});
	} catch (error) {
		console.error("Error getting blog post:", error);
		return NextResponse.error(new Error("Failed to get blog post"));
	}
}
export async function PUT(request, { params, body }) {
	try {
		// const { id } = params;
		// console.log(params);
		// console.log("Body", body);
		// console.log("Request", request);
		const { title, image, description } = await request.json();
		// console.log(title);
		// console.log(image);
		// console.log(description);

		const client = new MongoClient(uri, { useUnifiedTopology: true });
		await client.connect();
		const collection = client.db(dbName).collection("blogPosts");
		const toUpdate = {
			_id: new ObjectId(params.id),
		};
		const updateDoc = {
			$set: {
				title,
				description,
				image,
			},
		};
		const result = await collection.updateOne(toUpdate, updateDoc);
		console.log("Updatedd", result);
		await client.close();
		if (result.modifiedCount === 0) {
			return NextResponse.error(new Error("Failed to update blog post"));
		}
		return NextResponse.json({
			title,
			description,
			image,
		});
	} catch (error) {
		console.error("Error updating blog post:", error);
		return NextResponse.error(new Error("Failed to update blog post"));
	}
}
