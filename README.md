# FinanceTracker Frontend  

Web interface for managing personal finances and tracking transactions.  

Built with:  
- **Svelte 5**: For a reactive and efficient UI.  
- **Tailwind CSS**: For modern styling and responsive design.  

## Features  

- Landing page with general transaction statistics  
- Web interface for CRUD operations on stored transactions  
- Responsive design with Tailwind CSS  

## CI/CD Integration

This repository is configured with GitHub Actions. On every push to the `master` branch, the workflow will:
- Build the frontend application.
- Copy the built files to the designated static folder in the [Personal Finance Tracker Backend](https://github.com/dionisiyKDO/personal_finance_tracker_backend) repository.
- Commit and push the changes to the backend, triggering an automatic build there.

This automation ensures that your frontend updates are seamlessly integrated with the backend without manual intervention.

## Setup  

1. Clone this repository:  
    ```bash
    git clone https://github.com/dionisiyKDO/personal_finance_tracker_frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run development server:
    ```bash
    npm run dev
    ```

4. Build for production:
    ```bash
    npm run build
    ```

## Requirements

- Node.js 16+
- Running instance of [Personal finance tracker backend](https://github.com/dionisiyKDO/personal_finance_tracker_backend).
- Imported transactions history on backend side.
