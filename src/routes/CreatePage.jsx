import { useState } from "react";
import { supabase } from "../client";
import { useOutletContext } from "react-router-dom";

const CreatePage = () => {
  const [inputs, setInputs] = useState({
    'title': '',
    'content': '',
    'imageUrl': '',
    'secretKey': '',
    'videoUrl': '',
    'flags': '',
    'referencePostId': '' // Add reference post ID
  });
  const [imageFile, setImageFile] = useState(null);
  const [userId] = useOutletContext(); // Get userId from context

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (imageFile) {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`public/${imageFile.name}`, imageFile);
      if (error) {
        console.error(error);
        return null;
      }
      return data.Key;
    }
    return null;
  };

  const createPost = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadImage();

    await supabase
      .from('posts')
      .insert({
        title: inputs["title"], 
        content: inputs["content"], 
        image_url: imageUrl ? `https://your-supabase-url/storage/v1/object/public/${imageUrl}` : inputs["imageUrl"], // Use 'image_url' to match Supabase table
        secret_key: inputs["secretKey"], // Use 'secret_key' to match Supabase table
        video_url: inputs["videoUrl"], // Use 'video_url' to match Supabase table
        flags: inputs["flags"], 
        upvotes: 0,
        user_id: userId, // Use 'user_id' to match Supabase table
        reference_post_id: inputs["referencePostId"] // Add reference post ID
      });

    setInputs({
      'title': '',
      'content': '',
      'imageUrl': '',
      'secretKey': '',
      'videoUrl': '',
      'flags': '',
      'referencePostId': '' // Reset reference post ID
    });
    setImageFile(null);

    alert("Post is created successfully!");
  };

  return (
    <div className="create-page">
      <h2>Create a New Post</h2>
      <form className="form-container">
        <input type="text" name="title" id="title" placeholder="Title" onChange={handleChange} value={inputs["title"]} />
        <textarea name="content" id="content" placeholder="Content (Optional)" rows="10" onChange={handleChange} value={inputs["content"]}></textarea>
        <input type="url" name="imageUrl" id="imageUrl" placeholder="Image URL (Optional)" onChange={handleChange} value={inputs["imageUrl"]} />
        <input type="password" name="secretKey" id="secretKey" placeholder="Secret Key" onChange={handleChange} value={inputs["secretKey"]} />
        <input type="url" name="videoUrl" id="videoUrl" placeholder="Video URL (Optional)" onChange={handleChange} value={inputs["videoUrl"]} /> {/* Add input for video URL */}
        <input type="text" name="flags" id="flags" placeholder="Flags (Comma Separated)" onChange={handleChange} value={inputs["flags"]} />
        <input type="text" name="referencePostId" id="referencePostId" placeholder="Reference Post ID (Optional)" onChange={handleChange} value={inputs["referencePostId"]} /> {/* Add input for reference post ID */}
        <input type="file" name="imageFile" id="imageFile" onChange={handleImageChange} />
      </form>
      <button type="submit" onClick={createPost}>Create Post</button>
    </div>
  );
};

export default CreatePage;