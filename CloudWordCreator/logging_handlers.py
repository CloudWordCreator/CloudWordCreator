import logging
import json
import os
from urllib import request, error

class DiscordWebhookHandler(logging.Handler):
    """
    A custom logging handler that sends logs to a Discord Webhook.
    """
    def __init__(self):
        super().__init__()
        self.webhook_url = os.getenv('DISCORD_WEBHOOK_URL')

    def emit(self, record):
        if not self.webhook_url:
            return

        try:
            log_entry = self.format(record)
            
            # ログレベルに応じた色とタイトルの設定
            if record.levelno <= logging.INFO:
                color = 65280 # Green
                title = f"Report / Info : {record.module}"
            elif record.levelno <= logging.WARNING:
                color = 16776960 # Yellow
                title = f"Warning in {record.module}"
            else:
                color = 15158332 # Red
                title = f"Error in {record.module}"

            # Create the payload structure
            # Discord embeds are nice for errors
            payload = {
                "content": None,
                "embeds": [
                    {
                        "title": title,
                        "description": f"```{log_entry[:4000]}```", # Discord has a 4096 char limit for descriptions
                        "color": color,
                        "fields": [
                            {
                                "name": "Level",
                                "value": record.levelname,
                                "inline": True
                            },
                            {
                                "name": "Path",
                                "value": record.pathname,
                                "inline": True
                            }
                        ],
                        "footer": {
                            "text": "CloudWordCreator Log"
                        }
                    }
                ]
            }

            headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'CloudWordCreator-Logger'
            }

            data = json.dumps(payload).encode('utf-8')
            req = request.Request(self.webhook_url, data=data, headers=headers, method='POST')
            
            with request.urlopen(req) as response:
                pass

        except Exception:
            self.handleError(record)
