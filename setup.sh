#!/bin/bash

echo "🚀 Setting up AnalystMateAI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "📦 Installing Node.js dependencies..."
npm install

echo "🐍 Installing Python dependencies..."
pip install -r requirements.txt

echo "📝 Creating .env file..."
if [ ! -f .env ]; then
    cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
EOF
    echo "✅ Created .env file. Please update it with your OpenAI API key."
else
    echo "✅ .env file already exists."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your OpenAI API key"
echo "2. Start the backend: uvicorn main:app --reload --port 8000"
echo "3. Start the frontend: npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo "" 