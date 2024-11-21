import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from '../client';

const EditPage = () => {
  const params = useParams();
  const [inputs, setInputs] = useState({
    'title': '',
    'content': '',
    'imageUrl': ''
  });
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    fetchCrewmate().catch(console.error);
  }, [])

  const fetchCrewmate = async () => {
    setLoading(true);
    const {data} = await supabase
      .from('posts')
      .select()
      .eq('id', params.id);

      setInputs({
        'title': data[0].title,
        'content': data[0].content,
        'imageUrl': data[0].imageUrl
      });
      setLoading(false);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const updatePost = async (e) => {
    e.preventDefault();

    await supabase
      .from('posts')
      .update({title: inputs["title"], content: inputs["content"], imageUrl: inputs["imageUrl"]})
      .eq('id', params.id);

    alert("Post is updated successfully!");
  };

  return (
    <div className="edit-page">
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading...
        </div>
      ) : (
        <>
          <h2>Update Your Post</h2>
          <form className="form-container">
            <input type="text" name="title" id="title" placeholder="Title" onChange={handleChange} value={inputs["title"]} />
            <textarea name="content" id="content" placeholder="Content (Optional)" rows="10" onChange={handleChange} value={inputs["content"]}></textarea>
            <input type="url" name="imageUrl" id="imageUrl" placeholder="Image URL (Optional)" onChange={handleChange} value={inputs["imageUrl"]} />
          </form>
          <button type="submit" onClick={updatePost}>Update Post</button>
        </>
      )}
    </div>
  );
};

export default EditPage;