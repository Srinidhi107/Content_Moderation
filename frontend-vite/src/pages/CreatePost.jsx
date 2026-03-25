import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { axiosInstance, API } from "../api";


function CreatePost(){

  const [post,setPost] = useState("");
  const [posts,setPosts] = useState([]);
  const [isLoadingBackground,setIsLoadingBackground] = useState(true);
  // This controls button state so users get feedback while the post is being sent.
  const [isSubmitting,setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchPosts = async () => {
      try{
        const res = await axiosInstance.get(API.getPosts);
        setPosts(res.data);
      }finally{
        setIsLoadingBackground(false);
      }
    };

    fetchPosts();
  },[]);

  const createPost = async () => {

    // Trim avoids allowing posts made only of spaces.
    if(post.trim() === "") return;

    const user = JSON.parse(localStorage.getItem("user"));

    // Block post creation when no valid session exists.
    if(!user || !user.id){
      alert("Please login first");
      navigate("/");
      return;
    }

    try{
      setIsSubmitting(true);
      await axiosInstance.post(
        API.createPost,
        {
          // Why: Backend now trusts token identity, not user id from client payload.
          content: post.trim()
        }
      );

      navigate("/feed");
    }catch(err){
      console.error("Error creating post:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || err.message;
      alert("Failed to create post: " + errorMsg);
    }finally{
      setIsSubmitting(false);
    }
  };

  return(
    <div className="min-h-screen">
      <Navbar />

      {/* Centered compose card with blurred feed behind it so writing stays the primary focus. */}
      <main className="relative min-h-[calc(100vh-84px)] overflow-hidden px-4 py-8 sm:px-6">
        <div className="absolute inset-0">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 blur-[6px] opacity-40 saturate-50 pointer-events-none">
            {isLoadingBackground && [1, 2, 3, 4, 5, 6].map((item)=>(
              <div
                key={item}
                className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-3 h-4 w-28 animate-pulse rounded bg-slate-200" />
                <div className="mb-2 h-5 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
              </div>
            ))}

            {!isLoadingBackground && posts.map((backgroundPost)=>(
              <div
                key={backgroundPost.id}
                className="rounded-2xl border border-slate-100 bg-white/85 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              >
                <p className="mb-2 text-sm text-slate-500">
                  Posted by <span className="font-semibold text-slate-700">{backgroundPost.user?.username || "Unknown"}</span>
                </p>
                <h3 className="text-lg leading-7 text-slate-800">
                  {backgroundPost.content}
                </h3>
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center">
          <section className="w-full max-w-[350px] rounded-[30px] border border-white/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-600">
                    New Post
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-800">
                    Share something with the feed
                  </h3>
                </div>
              </div>

              <label className="mb-3 block text-sm font-medium text-slate-700"
              style={{ marginBottom: "12px" }}>
                Post content
              </label>
              <textarea
                value={post}
                onChange={(e)=>setPost(e.target.value)}
                placeholder="Share an update, ask a question, or start a discussion..."
                rows="10"
                maxLength="280"
                className="w-full rounded-[15px] border border-slate-200 bg-slate-50 px-5 py-4 text-base leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
              />

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Posts with banned abusive words will be rejected automatically.
                </p>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    className="inline-flex h-9 min-w-[92px] items-center justify-center rounded-[6px] border px-3 text-sm font-medium transition duration-200"
                    style={{ marginRight: "14px", borderColor: "#67e8f9", backgroundColor: "#ecfeff", color: "#155e75" }}
                    onClick={()=>navigate("/feed")}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 min-w-[126px] items-center justify-center rounded-[6px] border px-5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ borderColor: "#0891b2", backgroundColor: "#0891b2", color: "#ffffff" }}
                    onClick={createPost}
                    disabled={post.trim() === "" || isSubmitting}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Post"}
                  </button>
                </div>
              </div>
          </section>
        </div>
      </main>
    </div>
  );

}

export default CreatePost;