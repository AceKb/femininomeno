import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from '../client';

const EditPage = () => {
  const params = useParams();
  const [inputs, setInputs] = useState({
    'title': '',
    'content': '',
    'imageUrl': '',
    'videoUrl': '',
    'flags': '',
    'secretKey': ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchPost().catch(console.error);
  }, []);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select()
      .eq('id', params.id);

    setInputs({
      'title': data[0].title,
      'content': data[0].content,
      'imageUrl': data[0].imageUrl,
      'videoUrl': data[0].videoUrl,
      'flags': data[0].flags,
      'secretKey': ''
    });
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
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

  const updatePost = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadImage();

    const { error } = await supabase
      .from('posts')
      .update({
        title: inputs["title"], 
        content: inputs["content"], 
        imageUrl: imageUrl || inputs["imageUrl"], 
        videoUrl: inputs["videoUrl"], 
        flags: inputs["flags"]
      })
      .eq('id', params.id)
      .eq('secretKey', inputs["secretKey"]);

    if (error) {
      alert("Invalid secret key. Post not updated.");
      return;
    }

    alert("Post updated successfully!");
  };

  return (
    <div className="edit-page">
      <h2>Update Your Post</h2>
      <form className="form-container">
        <input type="text" name="title" id="title" placeholder="Title" onChange={handleChange} value={inputs["title"]} />
        <textarea name="content" id="content" placeholder="Content (Optional)" rows="10" onChange={handleChange} value={inputs["content"]}></textarea>
        <input type="url" name="imageUrl" id="imageUrl" placeholder="Image URL (Optional)" onChange={handleChange} value={inputs["imageUrl"]} />
        <input type="password" name="secretKey" id="secretKey" placeholder="Secret Key" onChange={handleChange} value={inputs["secretKey"]} />
        <input type="url" name="videoUrl" id="videoUrl" placeholder="Video URL (Optional)" onChange={handleChange} value={inputs["videoUrl"]} />
        <input type="text" name="flags" id="flags" placeholder="Flags (Comma Separated)" onChange={handleChange} value={inputs["flags"]} />
        <input type="file" name="imageFile" id="imageFile" onChange={handleImageChange} />
      </form>
      <button type="submit" onClick={updatePost}>Save Changes</button>
    </div>
  );
};

export default EditPage;
