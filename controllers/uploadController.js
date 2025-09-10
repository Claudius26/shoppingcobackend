const supabase = require('../config/supabase');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); 

exports.uploadProductImage = async (req, res) => {
  try {
    const file = req.file;
    const fileName = `products/${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return res.json({ imageUrl: publicUrlData.publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
