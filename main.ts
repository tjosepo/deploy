import { readableStreamFromReader } from "https://deno.land/std@0.113.0/streams/mod.ts";

// Start listening on port 8080 of localhost.
const server = await Deno.listen({ port: 8080 });
console.log("File server running on http://localhost:8080/");
for await (const conn of server) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    serveFile(requestEvent);
  }
}
async function serveFile(requestEvent: Deno.RequestEvent) {
  // Use the request pathname as filepath
  const url = new URL(requestEvent.request.url);
  const filepath = decodeURIComponent(url.pathname);
  // Try opening the file
  let file: Deno.File;
  try {
    file = await Deno.open("." + filepath);
  } catch (e) {
    // If the file cannot be opened, return a "404 Not Found" response
    const notFoundResponse = new Response("404 Not Found\n" + e, {
      status: 404,
    });
    await requestEvent.respondWith(notFoundResponse);
    return;
  }
  // Build a readable stream so the file doesn't have to be fully loaded into
  // memory while we send it
  // Build and send the response
  const response = new Response(readableStreamFromReader(file));
  await requestEvent.respondWith(response);
}
