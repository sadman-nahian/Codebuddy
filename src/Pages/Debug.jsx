import React from "react";
import { NavLink,Link,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { createClient } from '@supabase/supabase-js'
import { Bars,Rings } from 'react-loading-icons'

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(URL, KEY);
const Debug=()=>{
    const [comment, setComment] = useState("");

    const [posts,setPost]=useState([]);
    const[filterData,setFilteredData]=useState([]);
    const[searchItem,setSearchItem]=useState("");
    const [isLoading, setIsLoading] = useState(false); 
    const[upvote,setUpvote]=useState(0);
    const handleCommentChange = (event) => {
        setComment(event.target.value);  // Update state with input from the text field
    };
    
    const handleSubmitComment = async (event, postTitle) => {
        event.preventDefault();
        console.log("Submitting comment for title:", postTitle); 
        const { data, error } = await supabase
            .from('comments')
            .insert([
                { title: postTitle, comment: comment }
            ])
            .then(() => {
                window.location.reload();
            })

        if (error) {
            console.error('Error inserting comment:', error);
        } else {
            console.log('Comment saved:', data);
        }
        setComment("");  
    };
    

    const handleSearch=(event)=>{
        event.preventDefault();
        const{name,value}=event.target;
        setSearchItem(value);
        
    }
    const handleSortByLikes = () => {
        const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes); // Sort posts by likes in descending order
        setPost(sortedPosts); // Update the posts state with the sorted posts
    };
   
   

    // useEffect(()=>{
    //     setIsLoading(true);
    //     const getData=async()=>{
    //      const{data,error}=await supabase
    //      .from("codeBuddy")
    //      .select("*")
    //      .eq("type","debug")
    //      if(error){
    //         console.log(error)
    //      }else{
    //         setPost(data);
            
    //      }
         
    //     setIsLoading(false);
        

    //     }
    //     getData();
        

    // },[])
    useEffect(() => {
        setIsLoading(true);
    
        const fetchData = async () => {
            // First, fetch all the posts with type "debug"
            const { data: postData, error: postError } = await supabase
                .from("codeBuddy")
                .select("*")
                .eq("type", "debug");
    
            if (postError) {
                console.error('Error fetching posts:', postError);
                setIsLoading(false);
                return;
            }
    
            // Then, for each post, fetch the associated comments based on post title
            const postsWithComments = await Promise.all(postData.map(async post => {
                const { data: commentsData, error: commentsError } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('title', post.titile);  
    
                if (commentsError) {
                    console.error('Error fetching comments for:', post.titile, commentsError);
                    return {...post, comments: []};  // Return the post with an empty comment array on error
                }
    
                return {...post, comments: commentsData};  // Attach comments to the respective post
            }));
    
            setPost(postsWithComments);
            setIsLoading(false);
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        const filter = posts.filter(post =>
            post.titile.toLowerCase().includes(searchItem.toLowerCase())
        );
        setFilteredData(filter);
        console.log(filterData); 
    }, [searchItem]);

    const handleClick=()=>{
        window.location="/post";
    }
    return(
        <div className="container">
            
            <div className="left-pannel">
                <button className="new-button" onClick={handleClick} >+ NEW</button>
                <NavLink className="links" to="/">DEBUG</NavLink>
                <NavLink className="links" to="/random">RANDOM</NavLink>
                <NavLink className="links" to="/about">ABOUT</NavLink>
                <button className="popular" onClick={handleSortByLikes}>Most Popular</button>

            </div>
            <div className="right-pannel">
           
                
                <input type="text" className="input-field search" placeholder="serch by title" onChange={handleSearch}/>

                {/* loading animation here */}

                {isLoading && <Bars style={{marginTop:"400px",marginLeft:"200px",color:"green"}}/>}

                {searchItem.length > 0  ? (
                filterData.map((post, i) => (
                    <div className="post-container" key={i} >
                    
                    <div className="post-details"onClick={()=>{
                        window.location=`/${post.titile}`
                    }}>
                        <h2 className="post-titile">{post.titile}</h2>
                        <p className="post-details">{post.description}</p>
                        {post.imgUrl!=" " &&<img src={post.imgUrl} className="post-img"></img>}
                        <p className="timestamp">posted on :{post.created_at.substring(0,10)}</p>
                        {/* <Link to={post.titile}>more ...</Link> */}
                        
                        {/* Render Comments for this Post */}
                    
                        

                    </div>
                    <div className="comments-container">
                    <div className="comment-container">
                        {post.comments && post.comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <p>{comment.comment}</p> 
                            </div>
                        ))}
                    </div>
                    <div className="upvotes">
                        
                            
                        <button className="upvote" onClick={async()=>{
                            
                            await supabase
                            .from("codeBuddy")
                            .update({ likes: post.likes + 1 })
                            .eq("titile",post.titile)
                            .then(() => {
                                window.location.reload();
                            })
                            
                            

                        }}>upvote :{post.likes}</button>

                    </div>


                    </div>
                </div>
                ))
            ) :(
                posts.map((post,i)=>(
                
                    <div className="post-container" key={i} >
                    
                    <div className="post-details"onClick={()=>{
                        window.location=`/${post.titile}`
                    }}>
                        <h2 className="post-titile">{post.titile}</h2>
                        <p className="post-details">{post.description}</p>
                        {post.imgUrl!=" " &&<img src={post.imgUrl} className="post-img"></img>}
                        <p className="timestamp">posted on :{post.created_at.substring(0,10)}</p>
                        {/* <Link to={post.titile}>more ...</Link> */}
                        {/* Render Comments for this Post */}
                    

                        

                    </div>
                   
                    
                    
                    
                    <div className="comments-container">
                    <div className="comment-container">
                    <form onSubmit={(e) => handleSubmitComment(e, post.titile)}>
                                    <input 
                                        type="text" 
                                        value={comment}  
                                        onChange={handleCommentChange}
                                        placeholder="Write a comment..."
                                    />
                                    <button className="add-comment"type="submit">Submit Comment</button>
                                </form>
                    
                        {post.comments && post.comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <p>{comment.comment}</p>  
                            </div>
                        ))}
                    </div>
                        

                        <div className="upvotes">
                        
                            
                        <button className="upvote" onClick={async()=>{
                            
                            await supabase
                            .from("codeBuddy")
                            .update({ likes: post.likes + 1 })
                            .eq("titile",post.titile)
                            .then(() => {
                                window.location.reload();
                            })
                            
                            

                        }}>upvote :{post.likes}</button>
                        {/* comment section starting here */}
                         {/* <form onSubmit={(e) => handleSubmitComment(e, post.titile)}>
                                    <input 
                                        type="text" 
                                        value={comment}  
                                        onChange={handleCommentChange}
                                        placeholder="Write a comment..."
                                    />
                                    <button type="submit">Submit Comment</button>
                                </form> */}
                                
                        


                    </div>
                    
                    

                    </div>
                </div>
                

                ))
            ) 
                
            }

                

            </div>
            
        </div>
    )
}
export default Debug;