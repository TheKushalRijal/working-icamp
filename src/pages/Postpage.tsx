/* PostPage.css */

/* General page styles */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  
  /* Header section */
  .page-title {
    text-align: center;
    font-size: 2.5rem;
    color: #333;
    padding: 50px;
    background-color: #fff;
    margin-top: 30px; /* Adds space above the title */
    margin-bottom: 20px;
  }
  
  /* Post container styles */
  .post-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 20px;
    padding: 20px;
    max-width: 800px;
    width: 100%;
    transition: transform 0.3s ease;
  }
  
  .post-container:hover {
    transform: translateY(-5px);
  }
  
  /* Header for each post */
  .post-header h3 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  
  .post-description {
    font-size: 1rem;
    color: #555;
    margin-bottom: 20px;
  }
  
  /* Image styling */
  .post-image {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  /* Video styling */
  .post-video video {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  /* Location info */
  .post-location {
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  /* Price styling */
  .post-price {
    background-color: #ffebcc;
    padding: 10px;
    border-radius: 8px;
    font-size: 1.2rem;
    text-align: center;
    color: #f4511e;
    margin-top: 20px;
  }
  
  /* Posts list container */
  .posts-list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .post-container {
      margin: 10px;
      padding: 15px;
    }
  
    .page-title {
      font-size: 2rem;
    }
  }
  