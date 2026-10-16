# AdiReality — House Price Prediction

AdiReality is a React and Flask application that turns property details into status-aware price estimates. It connects a guided frontend workflow with six regression models trained on a national Realtor listing dataset.

## Frontend Experience

- Schema-driven property forms with validation for rooms, home size, lot size, and location.
- A price-context selector that distinguishes completed-sale prices from asking prices for listed or build-ready properties.
- Model selection and a comparison table showing held-out evaluation results.
- Sample inputs, clear/reset actions, loading and error states, and accessible result announcements.
- A prediction summary and chart showing an estimate with an absolute-error band measured on held-out data.

## Dataset and Modeling

The current training metadata records 2,226,382 source rows and 2,201,789 retained rows after quality filtering. Inputs include status, bedrooms, bathrooms, home size, lot size, state, city, and ZIP code. ZIP codes remain strings to preserve leading zeros.

Numeric values are imputed during training. Geographic and status features use cross-fitted target encoding to avoid encoding a training row with its own target. Models learn log-transformed prices, with scaling for the linear, SVR, and neural models.

Six candidates are compared on the same random 80/20 holdout, stratified by status. After evaluation, all saved prediction models are refitted on every retained row. XGBoost and the PyTorch neural network use CUDA when available, with CPU fallback and portable CPU inference.

## Current Evaluation Snapshot

The following rounded results come from the project's saved model metrics. Dollar errors combine asking-price and completed-sale records; they describe this dataset snapshot, not guaranteed accuracy for an individual home.

| Model | MAE (USD) | Median absolute error (USD) | R² |
| --- | ---: | ---: | ---: |
| Linear Regression | 256,511 | 74,147 | -2.154 |
| Linear SVR | 302,029 | 71,346 | -5.337 |
| PyTorch Neural Network | 217,264 | 67,652 | -0.555 |
| Histogram Gradient Boosting | 176,951 | 61,580 | 0.497 |
| Random Forest | 172,248 | 60,729 | 0.547 |
| XGBoost | 169,851 | 58,845 | 0.548 |

XGBoost has the lowest overall holdout MAE and is the default model. Evaluation also reports RMSE, MAPE, mean error, status-specific metrics, and an 80% absolute-error radius. The radius is measured on the holdout; it is not a guarantee of coverage for new properties.

## Engineering and Stack

React 19, Vite, CSS, Python, Flask, pandas, scikit-learn, PyTorch, and XGBoost. The Flask API validates prediction inputs and serves model metadata and generated form schemas, keeping frontend controls aligned with inference requirements.

## Scope and Limitations

The model estimates the dataset's recorded price conditioned on status: completed-sale price for sold properties, asking/list price for other supported statuses. The source has no reliable current observation date, so this app does not estimate today's market value or generate a monthly market trend.

The random holdout does not test future market conditions or unseen geographic regions. Data may contain duplicates, stale listings, or uneven market coverage. Results are educational estimates rather than appraisals or offers.

## Source and Evaluation Evidence

- [Project repository and setup](https://github.com/aadishrath/housePrediction)
- [Saved model metrics](https://github.com/aadishrath/housePrediction/blob/main/models/model_metrics.json)
- [Training metadata](https://github.com/aadishrath/housePrediction/blob/main/models/training_metadata.json)
