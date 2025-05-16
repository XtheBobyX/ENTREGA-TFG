const extractHashtags = (content: string): string[] => {
    const regex = /#([a-zA-Z0-9_]+)/g;  // Expresión regular para hashtags
    let hashtags: string[] = [];
    let match;
  
    // Encontramos todos los hashtags en el contenido
    while ((match = regex.exec(content)) !== null) {
      hashtags.push(match[0]);
    }
  
    return hashtags;
  };

  export default extractHashtags;