window.EXPERIMENT_EXAMPLES = [
  {
    number: 1,
    title: "Working with Different Data Formats",
    description: "Read a CSV sample, convert it to JSON, and save a CSV in the browser runtime.",
    code: `import pandas as pd
from io import StringIO

csv_text = """name,department,marks
Ravi,CSE,85
Sita,CSE,90
Arun,ECE,78
"""

data = pd.read_csv(StringIO(csv_text))
print("CSV data:")
print(data)

json_text = data.to_json(orient="records", indent=2)
json_data = pd.read_json(StringIO(json_text))
print("\\nRound-tripped JSON data:")
print(json_data)

data.to_csv("output.csv", index=False)
data.to_excel("output.xlsx", index=False)
excel_data = pd.read_excel("output.xlsx")
print("\\nExcel round-trip:")
print(excel_data)
print("\\nSaved output.csv and output.xlsx in the browser's temporary Python filesystem.")`
  },
  {
    number: 2,
    title: "Interacting with Web APIs and Databases",
    description: "Turn a representative API JSON response into a DataFrame and inspect selected fields.",
    code: `import pandas as pd

# A small sample response keeps this example runnable without a network request.
api_response = [
    {"id": 101, "title": "Improve documentation", "state": "open", "created_at": "2026-01-12"},
    {"id": 102, "title": "Fix index alignment", "state": "closed", "created_at": "2026-01-10"},
    {"id": 103, "title": "Add data validation", "state": "open", "created_at": "2026-01-08"},
]

issues = pd.DataFrame(api_response)
print(issues[["id", "title", "state", "created_at"]])
print("\\nOpen issues:", int((issues["state"] == "open").sum()))

open_issues = issues.loc[issues["state"] == "open", ["id", "title"]]
print("\\nOpen issue records:")
print(open_issues)`
  },
  {
    number: 3,
    title: "Data Cleaning and Preparation",
    description: "Handle missing values, transform categories, detect outliers, and clean whitespace.",
    code: `import numpy as np
import pandas as pd
import re

data = pd.DataFrame({
    "marks": [72, 85, np.nan, 91, 250],
    "gender": ["male", "female", "male", "female", "male"],
})
data["marks"] = data["marks"].fillna(data["marks"].median())
data["gender_num"] = data["gender"].map({"male": 0, "female": 1})
outliers = data["marks"] > 100

print("Cleaned data:")
print(data)
print("\\nOutlier rows:")
print(data.loc[outliers])
print("\\nWhitespace split:", re.split(r"\\s+", "Data   science\\tpractice"))`
  },
  {
    number: 4,
    title: "Data Wrangling",
    description: "Create a hierarchical index, reshape data, and combine overlapping DataFrames.",
    code: `import pandas as pd

scores = pd.DataFrame({
    "department": ["CSE", "CSE", "ECE", "ECE"],
    "year": [1, 2, 1, 2],
    "marks": [78, 85, 82, 91],
}).set_index(["department", "year"])

print("Hierarchical data:")
print(scores)
print("\\nUnstacked by year:")
print(scores["marks"].unstack())

left = pd.DataFrame({"math": [88, None], "science": [91, 84]}, index=["Asha", "Ravi"])
right = pd.DataFrame({"math": [79, 86], "english": [90, 87]}, index=["Ravi", "Sita"])
print("\\nCombined data:")
print(left.combine_first(right))`
  },
  {
    number: 5,
    title: "Data Visualization with Matplotlib",
    description: "Create a labeled line plot and annotate its highest value.",
    code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May"]
marks = [68, 74, 71, 86, 92]
highest = max(range(len(marks)), key=marks.__getitem__)

fig, ax = plt.subplots()
ax.plot(months, marks, marker="o", color="#6658d9")
ax.set(title="Monthly Assessment Scores", xlabel="Month", ylabel="Marks")
ax.set_ylim(0, 100)
ax.annotate("Highest", (months[highest], marks[highest]), xytext=(8, -18), textcoords="offset points")
ax.grid(True, alpha=0.25)
plt.tight_layout()
plt.show()`
  },
  {
    number: 6,
    title: "Time Series Analysis",
    description: "Build a daily time series and resample it into weekly averages.",
    code: `import pandas as pd

dates = pd.date_range("2026-01-01", periods=14, freq="D")
values = [12, 14, 13, 16, 15, 17, 18, 19, 17, 20, 22, 21, 23, 24]
series = pd.Series(values, index=dates, name="visits")

print("Daily observations:")
print(series.head())
print("\\nWeekly average:")
print(series.resample("W").mean().round(1))
print("\\nConverted to monthly periods:")
print(series.to_period("M").head())`
  },
  {
    number: 7,
    title: "Data Aggregation",
    description: "Group records by department and calculate summary statistics.",
    code: `import pandas as pd

students = pd.DataFrame({
    "name": ["Ravi", "Sita", "Arun", "Priya", "Kiran", "Anil"],
    "department": ["CSE", "CSE", "ECE", "ECE", "CSE", "ECE"],
    "year": [2, 2, 3, 3, 2, 3],
    "marks": [85, 90, 78, 88, 75, 82],
})

summary = students.groupby("department")["marks"].agg(["count", "mean", "sum"])
print("Summary by department:")
print(summary)
print("\\nMean marks by department and year:")
print(students.groupby(["department", "year"])["marks"].mean())`
  },
  {
    number: 8,
    title: "Web Scraping and Product Review Analysis",
    description: "Parse sample review HTML and organize the extracted fields into a DataFrame.",
    code: `from bs4 import BeautifulSoup
import pandas as pd

html_content = """
<div class="review">
  <h3 class="review-title">Great product</h3>
  <p class="review-text">Excellent quality and easy to use.</p>
  <span class="rating">5 out of 5</span>
</div>
<div class="review">
  <h3 class="review-title">Not satisfied</h3>
  <p class="review-text">The product stopped working quickly.</p>
  <span class="rating">2 out of 5</span>
</div>
"""

soup = BeautifulSoup(html_content, "html.parser")
records = []
for block in soup.select(".review"):
    records.append({
        "title": block.select_one(".review-title").get_text(" ", strip=True),
        "review": block.select_one(".review-text").get_text(" ", strip=True),
        "rating": block.select_one(".rating").get_text(" ", strip=True),
    })

reviews = pd.DataFrame(records)
print(reviews)
print("\\nReviews extracted:", len(reviews))`
  },
  {
    number: 9,
    title: "Customer Personality Analysis",
    description: "Scale customer features and group the sample customers with K-means clustering.",
    code: `import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

customers = pd.DataFrame({
    "income": [28, 32, 35, 72, 78, 82, 45, 50],
    "annual_spend": [12, 15, 18, 62, 70, 67, 28, 33],
})

features = StandardScaler().fit_transform(customers)
model = KMeans(n_clusters=2, random_state=7, n_init=10)
customers["segment"] = model.fit_predict(features)

print("Customer segments:")
print(customers)
print("\\nAverage customer profile by segment:")
print(customers.groupby("segment")[["income", "annual_spend"]].mean().round(1))`
  },
  {
    number: 10,
    title: "Text Emotion Detection",
    description: "Train a small text classifier and predict emotions for new messages.",
    code: `from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

training_text = [
    "I am happy and excited",
    "This is wonderful news",
    "I feel angry and upset",
    "That makes me furious",
    "I am sad and lonely",
    "I feel down today",
]
training_labels = ["happy", "happy", "angry", "angry", "sad", "sad"]

model = make_pipeline(CountVectorizer(), MultinomialNB())
model.fit(training_text, training_labels)

messages = ["I am happy and excited", "I feel angry and upset", "I am sad and lonely"]
for message, emotion in zip(messages, model.predict(messages)):
    print(f"{message!r} -> {emotion}")`
  }
];
