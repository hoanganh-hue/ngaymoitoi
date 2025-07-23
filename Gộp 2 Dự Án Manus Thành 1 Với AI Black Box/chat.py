from flask import Blueprint, request, jsonify
import requests
import json
import os
import sys
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

chat_bp = Blueprint('chat', __name__)

# Blackbox AI configuration
BLACKBOX_API_URL = "https://api.blackbox.ai/chat/completions"
BLACKBOX_API_KEY = "sk-Qz7-NKEIN7QgQ1PkBkRSTQ"

# OpenManus integration (placeholder for now)
class OpenManusAgent:
    def __init__(self):
        self.active = True
    
    def process_request(self, message, mode='hybrid'):
        # This is a placeholder - in real implementation, this would integrate with OpenManus
        if mode == 'openmanus':
            return f"OpenManus Agent response: Đang xử lý yêu cầu '{message}' với các công cụ OpenManus..."
        elif mode == 'hybrid':
            return f"Hybrid Mode: Blackbox AI đang điều khiển OpenManus để xử lý '{message}'"
        else:
            return "Unknown mode"

openmanus_agent = OpenManusAgent()

@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        mode = data.get('mode', 'hybrid')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        response_content = ""
        
        if mode == 'blackbox':
            # Pure Blackbox AI mode
            response_content = call_blackbox_api(message)
        elif mode == 'openmanus':
            # Pure OpenManus mode
            response_content = openmanus_agent.process_request(message, mode)
        elif mode == 'hybrid':
            # Hybrid mode - Blackbox AI controls OpenManus
            blackbox_instruction = f"""
            Bạn là một AI assistant điều khiển OpenManus agent. 
            Người dùng hỏi: "{message}"
            
            Hãy phân tích yêu cầu và đưa ra hướng dẫn cụ thể cho OpenManus agent để thực hiện tác vụ này.
            Trả lời bằng tiếng Việt và đưa ra các bước cụ thể.
            """
            blackbox_response = call_blackbox_api(blackbox_instruction)
            
            # Simulate OpenManus execution based on Blackbox instruction
            openmanus_response = openmanus_agent.process_request(message, mode)
            
            response_content = f"🤖 Blackbox AI Analysis:\n{blackbox_response}\n\n🔧 OpenManus Execution:\n{openmanus_response}"
        
        return jsonify({
            'response': response_content,
            'mode': mode,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def call_blackbox_api(message):
    """Call Blackbox AI API"""
    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {BLACKBOX_API_KEY}"
        }
        
        data = {
            "model": "blackboxai/qwen/qwq-32b:free",
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ]
        }
        
        response = requests.post(BLACKBOX_API_URL, headers=headers, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            return f"Lỗi API Blackbox: {response.status_code} - {response.text}"
            
    except requests.exceptions.Timeout:
        return "Lỗi: Timeout khi gọi API Blackbox"
    except requests.exceptions.RequestException as e:
        return f"Lỗi kết nối API Blackbox: {str(e)}"
    except Exception as e:
        return f"Lỗi không xác định: {str(e)}"

@chat_bp.route('/chat/history', methods=['GET'])
def get_chat_history():
    # Placeholder for chat history - in real implementation, this would use database
    return jsonify({
        'history': [],
        'message': 'Chat history feature will be implemented with database integration'
    })

@chat_bp.route('/config', methods=['GET', 'POST'])
def config():
    if request.method == 'GET':
        return jsonify({
            'blackbox_api_key': BLACKBOX_API_KEY[:10] + "..." if BLACKBOX_API_KEY else None,
            'openmanus_status': openmanus_agent.active,
            'available_modes': ['blackbox', 'openmanus', 'hybrid']
        })
    
    elif request.method == 'POST':
        data = request.get_json()
        # In real implementation, this would update configuration
        return jsonify({'message': 'Configuration updated successfully'})

@chat_bp.route('/models', methods=['GET'])
def get_models():
    return jsonify({
        'blackbox_models': [
            'blackboxai/qwen/qwq-32b:free',
            'blackboxai/gpt-4o',
            'blackboxai/claude-3.5-sonnet'
        ],
        'openmanus_agents': [
            'general_agent',
            'data_analysis_agent',
            'code_agent'
        ]
    })

