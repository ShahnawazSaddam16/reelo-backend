const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  username: { type: String, required: true },
  avator: { type: String, default: null },   
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
