import React, { useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Message {
  text: string;
  isUser: boolean;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);
    setInput("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/query/", {
        query: input,
      });
      const botMessage: Message = {
        text: response.data.response,
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError("Failed to fetch response from the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Chat</Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "10px",
          bgcolor: "#f0f2f5",
        }}
      >
        {messages.map((msg, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              padding: "10px",
              margin: "5px",
              borderRadius: "20px",
              alignSelf: msg.isUser ? "flex-end" : "flex-start",
              backgroundColor: msg.isUser ? "#0084ff" : "#fff",
              color: msg.isUser ? "#fff" : "#000",
              maxWidth: "80%",
            }}
          >
            {msg.text}
          </Paper>
        ))}
        {loading && (
          <Box display="flex" justifyContent="center" marginTop="10px">
            <CircularProgress />
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </Box>

      <Box display="flex" justifyContent="space-between" marginTop={2}>
        <TextField
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default Chat;
