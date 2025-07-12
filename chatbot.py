from dotenv import load_dotenv
load_dotenv()  # Loads .env from the current directory by default
import os
import json
from typing import List, Dict, Any
from openai import OpenAI
from chatbot_prompt import CHATBOT_PROMPT
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AnalystMateChatbot:
    def __init__(self, api_key: str = None):
        """Initialize the chatbot with OpenAI API key."""
        # Debug: Check what we're getting from environment
        env_key = os.getenv("OPENAI_API_KEY")
        print(f"🔍 Debug: Environment variable OPENAI_API_KEY = {'Found' if env_key else 'Not found'}")
        if env_key:
            print(f"🔍 Debug: API key starts with: {env_key[:10]}...")

        self.api_key = api_key or env_key
        if not self.api_key:
            print("🔍 Debug: No API key found in parameter or environment variable")
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass it directly.")

        print("✅ API key loaded successfully")
        self.client = OpenAI(api_key=self.api_key)
        self.conversation_history = []
        self.filing_context = {}

    def load_filing_context(self, company_name: str, filing_date: str,
                            fiscal_year: str, filing_text: str,
                            analysis_results: Dict[str, Any]):
        """Load filing context for the chatbot."""
        self.filing_context = {
            "company_name": company_name,
            "filing_date": filing_date,
            "fiscal_year": fiscal_year,
            "filing_text": filing_text,
            "analysis_results": analysis_results
        }
        print(f"✅ Loaded context for {company_name} ({fiscal_year})")

    def load_filing_from_files(self, filing_text_file: str, analysis_results_file: str,
                               company_name: str = "Unknown Company",
                               filing_date: str = "Unknown Date",
                               fiscal_year: str = "Unknown Year"):
        """Load filing context from text files."""
        try:
            # Load filing text
            with open(filing_text_file, 'r', encoding='utf-8') as f:
                filing_text = f.read()

            # Load analysis results
            with open(analysis_results_file, 'r', encoding='utf-8') as f:
                analysis_results = json.load(f)

            self.load_filing_context(company_name, filing_date, fiscal_year, filing_text, analysis_results)
            return True

        except FileNotFoundError as e:
            print(f"❌ File not found: {e}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in analysis results: {e}")
            return False
        except Exception as e:
            print(f"❌ Error loading files: {e}")
            return False

    def get_response(self, user_question: str) -> str:
        """Get chatbot response for user question."""
        if not self.filing_context:
            return "❌ No filing context loaded. Please load a filing context first."

        try:
            # Format the prompt with context
            formatted_prompt = CHATBOT_PROMPT.format(
                company_name=self.filing_context["company_name"],
                filing_date=self.filing_context["filing_date"],
                fiscal_year=self.filing_context["fiscal_year"],
                filing_text=self.filing_context["filing_text"][:15000],  # Limit for token management
                previous_analysis=json.dumps(self.filing_context["analysis_results"], indent=2)
            )

            messages = [
                {"role": "system", "content": formatted_prompt}
            ]

            messages.extend(self.conversation_history)
            messages.append({"role": "user", "content": user_question})

            model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=1000,
                temperature=0.3
            )

            assistant_response = response.choices[0].message.content

            # Add to conversation history
            self.conversation_history.append({"role": "user", "content": user_question})
            self.conversation_history.append({"role": "assistant", "content": assistant_response})

            # Keep only last 20 exchanges to manage token limits
            if len(self.conversation_history) > 20:
                self.conversation_history = self.conversation_history[-20:]

            return assistant_response

        except Exception as e:
            logger.error(f"Error getting response: {str(e)}")
            return f"❌ Error getting response: {str(e)}"

    def clear_conversation(self):
        """Clear the conversation history."""
        self.conversation_history = []
        print("🧹 Conversation history cleared.")

    def show_context_summary(self):
        """Show a summary of the loaded filing context."""
        if not self.filing_context:
            print("❌ No filing context loaded.")
            return

        print("\n📊 FILING CONTEXT SUMMARY:")
        print(f"Company: {self.filing_context['company_name']}")
        print(f"Filing Date: {self.filing_context['filing_date']}")
        print(f"Fiscal Year: {self.filing_context['fiscal_year']}")
        print(f"Filing Text Length: {len(self.filing_context['filing_text'])} characters")
        print(f"Analysis Categories: {list(self.filing_context['analysis_results'].keys())}")

        # Show analysis summary
        for category, items in self.filing_context['analysis_results'].items():
            if items:
                print(f"  {category.upper()}: {len(items)} items")
        print()


def main():
    """Main function to run the chatbot."""
    print("🤖 AnalystMate AI Chatbot")
    print("=" * 50)

    # Debug: Show all environment variables that start with OPENAI
    print("🔍 Debug: Checking environment variables...")
    for key, value in os.environ.items():
        if key.startswith("OPENAI"):
            print(f"🔍 Found: {key} = {value[:10]}...")

    # Initialize chatbot
    try:
        chatbot = AnalystMateChatbot()
    except ValueError as e:
        print(f"❌ {e}")
        print("\n🔑 Would you like to enter your API key manually? (y/n)")
        if input().lower() == 'y':
            api_key = input("Enter your OpenAI API key: ").strip()
            if api_key:
                try:
                    chatbot = AnalystMateChatbot(api_key=api_key)
                except Exception as e:
                    print(f"❌ Error with provided API key: {e}")
                    return
            else:
                print("❌ No API key provided. Exiting.")
                return
        else:
            return

    # Load filing context
    print("\n📁 LOADING FILING CONTEXT...")
    print("You can either:")
    print("1. Load from files (filing_text.txt and analysis_results.json)")
    print("2. Enter context manually")
    print("3. Use sample data for testing")

    choice = input("\nEnter your choice (1/2/3): ").strip()

    if choice == "1":
        filing_text_file = input("Enter filing text file path: ").strip()
        analysis_results_file = input("Enter analysis results file path: ").strip()
        company_name = input("Enter company name (optional): ").strip() or "Unknown Company"
        filing_date = input("Enter filing date (optional): ").strip() or "Unknown Date"
        fiscal_year = input("Enter fiscal year (optional): ").strip() or "Unknown Year"

        if not chatbot.load_filing_from_files(filing_text_file, analysis_results_file,
                                              company_name, filing_date, fiscal_year):
            print("❌ Failed to load filing context. Exiting.")
            return

    elif choice == "2":
        print("❌ Manual entry not implemented yet. Use option 1 or 3.")
        return

    elif choice == "3":
        # Sample data for testing
        sample_analysis = {
            "legal": ["Ongoing SEC investigation regarding revenue recognition practices"],
            "financial": ["Revenue declined 15% year-over-year", "Debt-to-equity ratio increased to 2.1"],
            "regulatory": ["New compliance requirements for data privacy regulations"],
            "operational": ["Supply chain disruptions affecting 30% of operations"],
            "esg": ["Climate risk assessment shows material exposure to flooding"],
            "other": ["CEO compensation increased 45% despite declining performance"]
        }

        chatbot.load_filing_context(
            company_name="Sample Corp",
            filing_date="2024-03-15",
            fiscal_year="2023",
            filing_text="Sample 10-K filing text with business operations, risk factors, and financial statements...",
            analysis_results=sample_analysis
        )
    else:
        print("❌ Invalid choice. Exiting.")
        return

    # Show context summary
    chatbot.show_context_summary()

    # Chat loop
    print("\n💬 CHAT WITH YOUR FILING:")
    print("Type your questions about the SEC filing.")
    print("Commands: 'clear' to clear history, 'context' to show context, 'quit' to exit")
    print("-" * 50)

    while True:
        try:
            user_input = input("\n👤 You: ").strip()

            if user_input.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            elif user_input.lower() == 'clear':
                chatbot.clear_conversation()
                continue
            elif user_input.lower() == 'context':
                chatbot.show_context_summary()
                continue
            elif not user_input:
                continue

            print("🤖 AnalystMate: ", end="")
            response = chatbot.get_response(user_input)
            print(response)

        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()
