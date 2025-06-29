import csv
import random
from datetime import datetime, timedelta

# סוגי אירועים
event_types = [
    "Wedding", "Engagement", "Bar Mitzvah", "Bat Mitzvah", "Henna Ceremony",
    "Birthday Party", "Brit/Circumcision"
]

# תוספות אפשריות
additional_fees_options = [
    "Premium Bar", "Floral Decorations", "Special Food Stations", "Special Lighting",
    "Video Photography", "Special Sound System", "Transportation Services", "VIP DJ"
]

# יצירת רשומות
rows = []
for i in range(1, 401):  # 400 רשומות
    event_id = i
    event_type = random.choice(event_types)
    event_date = datetime.today() + timedelta(days=random.randint(30, 600))
    event_date_str = event_date.strftime("%Y-%m-%d")
    available_seats = random.randint(50, 1500)
    additional_fees = random.choice(additional_fees_options)

    rows.append([event_id, event_type, event_date_str, available_seats, additional_fees])

# כתיבה לקובץ CSV
with open("events_data.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["EventId", "EventType", "EventDate", "Available_seats", "Additional_fees"])
    writer.writerows(rows)

print("✅ הקובץ events_data.csv נוצר בהצלחה עם 400 אירועים.")
