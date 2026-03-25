import React,{useState,useEffect} from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { axiosInstance, API } from "../api";

function Feed(){

  // Store feed data and small UI states locally so the page reacts immediately to user actions.
  const [posts,setPosts] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const [commentInputs,setCommentInputs] = useState({});
  const [editingPostId,setEditingPostId] = useState(null);
  const [editContent,setEditContent] = useState("");

  // Read the active user once from localStorage so ownership checks can be done in the UI.
  const loggedUser = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(()=>{
    // Load the feed once when the page opens, similar to how social apps fetch posts on landing.
    fetchPosts();
  },[]);

  const fetchPosts = async () =>{

    // Centralized fetch makes it easy to refresh the screen after create/edit/delete/comment/like.
    setIsLoading(true);

    try{
      const res = await axiosInstance.get(API.getPosts);

      setPosts(res.data);
    }finally{
      // End the loading state whether the request succeeds or fails so the UI does not get stuck.
      setIsLoading(false);
    }

  };

  const deletePost = async (id)=>{

    // Delete then refresh so the removed post disappears immediately from the feed.
    await axiosInstance.delete(
      API.deletePost(id)
    );

    fetchPosts();

  };

  const startEditing = (post)=>{
    // Pre-fill the textarea with the current post text so editing feels inline and natural.
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  const cancelEditing = ()=>{
    // Reset edit state so the card goes back to normal read-only mode.
    setEditingPostId(null);
    setEditContent("");
  };

  const saveEdit = async (id)=>{

    try{
      // Save the updated text for only the selected post, then reload the feed with latest backend data.
      await axiosInstance.put(
        API.updatePost(id),
        { content: editContent }
      );

      setEditingPostId(null);
      setEditContent("");
      fetchPosts();
    }catch(err){
      const errorMsg = err.response?.data?.message || err.response?.data || err.message;
      alert("Edit rejected: " + errorMsg);
    }

  };

  // Like handler with a session check, similar to social apps that require login before reacting.
  const toggleLike = async (postId)=>{

    // Why: Prevent runtime errors and unauthorized like calls when no user is logged in.
    // Use: Stops the request early and gives clear feedback instead of crashing on loggedUser.id.
    if(!loggedUser?.id){
      alert("Please login to like posts.");
      return;
    }

    await axiosInstance.post(
      API.likePost(postId),
      {}
    );

    fetchPosts();

  };

  const submitComment = async (postId)=>{

    // Skip empty comments so users do not accidentally submit blank text.
    if(!commentInputs[postId]) return;

    try{
      // The backend links this comment to the selected post id, then the feed reloads with the new comment.
      await axiosInstance.post(
        API.addComment,
        {
          text:commentInputs[postId],
          post:{ id:postId }
        }
      );

      setCommentInputs({
        ...commentInputs,
        [postId]:""
      });

      fetchPosts();
    }catch(err){
      const errorMsg = err.response?.data?.message || err.response?.data || err.message;
      alert("Comment rejected: " + errorMsg);
    }

  };

  return(

    <div className="min-h-screen">
      {/* Shared top navigation keeps movement between feed/create-post consistent across the app. */}
      <Navbar />

      {/* Side-by-side portrait cards with centered alignment for a cleaner multi-card feed. */}
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8">
        <div className="mb-8 px-1 text-center">
          <h1 className="text-3xl font-semibold text-slate-800">
            Community Feed
          </h1>
          <p className="text-slate-500 mt-2">
            Read posts, join discussions, and share your thoughts.
          </p>
        </div>

        {/* Loading skeleton gives the page structure immediately, similar to modern social feeds. */}
        {isLoading && (
          <div className="grid grid-cols-2 xl:grid-cols-3" style={{ columnGap: "24px", rowGap: "40px" }}>
            {[1, 2, 3].map((item)=>(
              <div
                key={item}
                className="mx-auto w-full max-w-[420px] rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-3 h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="mb-2 h-5 w-full animate-pulse rounded bg-slate-200" />
                <div className="mb-4 h-5 w-4/5 animate-pulse rounded bg-slate-200" />
                <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state makes a new account feel intentional instead of showing a blank page. */}
        {!isLoading && posts.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/75 px-6 py-12 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-600">
              Feed Empty
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-800">
              No posts yet
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Be the first one to publish a thought and start the discussion in your community.
            </p>
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-2 xl:grid-cols-3" style={{ columnGap: "24px", rowGap: "40px" }}>
            {posts.map((p)=>(
              <PostCard
                key={p.id}
                post={p}
                loggedUser={loggedUser}
                isEditing={editingPostId === p.id}
                editContent={editContent}
                onEditContentChange={setEditContent}
                onStartEditing={startEditing}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEditing}
                onToggleLike={toggleLike}
                onDeletePost={deletePost}
                commentInput={commentInputs[p.id] || ""}
                onCommentInputChange={(value)=>setCommentInputs({
                  ...commentInputs,
                  [p.id]:value
                })}
                onSubmitComment={submitComment}
              />

            ))}
          </div>
        )}

      </div>

    </div>

  );

}

export default Feed;