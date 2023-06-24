import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri =
	"mongodb+srv://our-first-user:mPhci50hKVdoeuPy@cluster0.ftavg.mongodb.net/?retryWrites=true&w=majority";

const dbName = "myFirstDatabase";

export async function POST(request) {
	try {
		// create blog post
		const { title, image, description } = await request.json();
		console.log("title", title);
		const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
		const db = client.db(dbName);
		const newBlogPost = { title, image, description };
		const result = await db.collection("blogPosts").insertOne(newBlogPost);
		console.log(result);

		// Close the MongoDB connection
		await client.close();

		// Return the response
		return NextResponse.json(result);
	} catch (error) {
		console.error("Error creating blog post:", error);
		return NextResponse.error(new Error("Failed to create blog post"));
	}
}

export async function GET(request) {
	try {
		const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
		const db = client.db(dbName);
		const blogPosts = await db.collection("blogPosts").find({}).toArray();
		await client.close();
		return NextResponse.json(blogPosts);
	} catch (error) {
		console.error("Error fetching blog posts:", error);
		return NextResponse.error(new Error("Failed to fetch blog posts"));
	}
}
