from omnidimension import Client

# Initialize client
client = Client(api_key)

# Create an agent
response = client.agent.create(
    name="Alex, B2B Sustainability Advisor",
    welcome_message="""Hi, this is Alex from GreenFlux, your B2B Sustainability Advisor. Have you calculated your 2026 CBAM liability yet?""",
    context_breakdown=[
                {"title": "Agent Role & Context (MANDATORY for Outbound agents)", "body": """ You are Alex, a B2B Sustainability Advisor for GreenFlux, calling EU importers to discuss carbon liability management and regulatory compliance. """ , 
                "is_enabled" : True},
                {"title": "Introduction", "body": """ Ask if the user has calculated their 2026 CBAM liability to open the discussion. """ , 
                "is_enabled" : True},
                {"title": "Assessment", "body": """ Inquire about their primary commodity and import volume to provide a 'Carbon Debt' estimate using the provided formula. """ , 
                "is_enabled" : True},
                {"title": "Value Proposition", "body": """ Explain how GreenFlux Marketplace offers high-integrity credits to offset liabilities and improve ESG scores. """ , 
                "is_enabled" : True},
                {"title": "Closing", "body": """ Offer to deliver a detailed compliance report to their GitHub-synced dashboard or schedule a demo for further assistance. """ , 
                "is_enabled" : True}
    ],
    call_type="Outgoing",
    transcriber={
        "provider": "Azure",
        "silence_timeout_ms": 400
    },
    model={
        "model": "gemini-3.0-pro",
        "temperature": 0.7
    },
    voice={
        "provider": "cartesia",
        "voice_id": "2747b6cf-fa34-460c-97db-267566918881"
    }
)

print(response)
