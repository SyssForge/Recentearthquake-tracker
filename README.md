# 🌎 Recent Earthquake Visualizer

An interactive web application designed for geography students and enthusiasts like Casey, who need to visualize recent earthquake activity around the world to understand seismic patterns. This app provides a clean, full-screen map interface with multiple data layers and visualization tools, built with React and TypeScript.

## Live Demo
[https://recentearthquake-tracker.vercel.app/](https://recentearthquake-tracker.vercel.app/)

## Screenshot
<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/f3c707b5-544c-43fa-95b7-62685a765ee4" />

<img width="1919" height="968" alt="image" src="https://github.com/user-attachments/assets/ea8a77c9-5372-4817-bc1c-1435041949f1" />

<img width="1919" height="965" alt="image" src="https://github.com/user-attachments/assets/f9c89a92-5afe-4746-9314-be5819df0a8d" />






## ✨ Features

This application is packed with features designed for a rich, user-friendly experience:

  * **Live Data Visualization:** Fetches and displays the latest earthquake data from the **U.S. Geological Survey (USGS)** API, updated for the past 24 hours.
  * **Interactive Map:** A smooth, full-screen map experience built with **Leaflet** and **React-Leaflet**, allowing for easy panning and zooming.
  * **Data-Driven Markers:** Earthquake markers are intuitively styled:
      * **Color-Coded:** Red for strong quakes (5.0+), yellow for moderate (3.0-4.9), and green for minor (\< 3.0).
      * **Size-Based:** The size of the marker directly corresponds to the earthquake's magnitude.
  * **Detailed Information Panel:** Clicking any earthquake marker opens a sleek side panel on the right, showing detailed information such as location, magnitude, and time, with a direct link to the official USGS report.
  * **Smart Geocoding Search:** Users can search for any country or city. The application uses the **OpenStreetMap (Nominatim)** 
  * **Search Suggestions (Autocomplete):** A dropdown list of location suggestions appears as the user types, powered by a debounced API call for a smooth and efficient experience.
  * **Multiple Map Layers:** A layer control in the top-right allows the user to switch between different map themes to suit their needs:
      * Street Map (Default)
      * Dark Map
      * Satellite View
      * Topographic Map
  * **UI Dark Mode Toggle:** A dedicated emoji toggle (☀️/🌙) in the bottom-right corner controls a separate dark/light theme for all UI panels (search card, side panel, legend), allowing for personalization and better readability.
  * **Constrained Map Boundaries:** The map is locked to a single world view, preventing confusing horizontal repeating or vertical panning into blank space.

-----

## 🛠️ Technology Stack

  * **Framework:** React
  * **Language:** TypeScript
  * **Build Tool:** Vite
  * **Mapping Library:** Leaflet & React-Leaflet
  * **Styling:** CSS with CSS Variables for easy theming
  * **APIs:**
      * USGS Earthquake API (for seismic data)
      * OpenStreetMap Nominatim (for geocoding search)

-----

## 🚀 Getting Started (Running Locally)

To get a local copy up and running, follow these simple steps.

### Prerequisites

You must have [Node.js](https://nodejs.org/) (version 16 or later) and `npm` installed on your machine.

### Installation

1.  **Clone the repository** from your GitHub account:
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd your-repository-name
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Your application will be running at `http://localhost:5173`.

-----

## 📖 How to Use the Application

  * **Explore the Map:** Pan by clicking and dragging. Zoom using your mouse wheel or the zoom controls in the bottom-right.
  * **Get Details:** Click on any colored circle (earthquake) to open a detailed side panel on the right. Click the 'x' or anywhere outside the panel to close it.
  * **Search for a Location:** Use the search bar in the top-left card. As you type, suggestions will appear. Click a suggestion or press Enter to fly to that location.
  * **Change the Map Style:** Use the layer control icon in the top-right corner to switch between map views.
  * **Change the UI Theme:** Use the emoji toggle (🌙/☀️) in the bottom-right corner to switch the UI panels between light and dark mode.
