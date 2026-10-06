This project builds and evaluates multiple machine learning models to predict house prices based on various features. It includes data preprocessing, feature selection, hyperparameter tuning, and model evaluation. The best performing combination for each model is saved and later used for prediction via React UI.

  - Data preprocessing: cleaning, scaling, and feature selection
  - Model training: using six different regression algorithms
  - Hyperparameter tuning: via GridSearchCV with cross-validation
  - Evaluation: using MAE, MSE, RMSE, and R² Score
  - Model saving: best models, scalers, and selected features are saved for predictions through React UI

## 🔍 Models Used
  The following models are trained and tuned:
    - Linear Regression: baseline model with no hyperparameters
    - Decision Tree Regressor:
      - max_depth, min_samples_split
    - Random Forest Regressor:
      - n_estimators, max_depth, min_samples_split
    - Support Vector Machine (SVR):
      - C, kernel, gamma
    - XGBoost Regressor:
      - n_estimators, max_depth, learning_rate, subsample
    - Neural Network (MLPRegressor):
      - hidden_layer_sizes, activation, learning_rate_init

  Each model undergoes feature selection using either:
    - Recursive Feature Elimination (RFE) for linear models
    - SelectFromModel for tree-based models

## 📁 Project Structure

  ├── README.md             # Project documentation
  ├── house_data.csv        # Input dataset
  ├── requirements.txt      # Project libraries
  ├── train_model.py        # Main training script
  ├── app.py                # Flask script to setup backend for UI
  ├── models/               # Saved models and metadata 
  ├── scalers/              # Saved scalers per model 
  ├── features/             # Selected features and feature order 
  ├── react-ui/             # Interactive UI for user


## 🧹 Dropped Features Before Training
  Certain features were dropped prior to model training due to the following reasons:

    | Feature       | Reason for Dropping                                     |
    |---------------|---------------------------------------------------------|
    | id            | Unique identifier; no predictive value                  |
    | date          | Timestamp of sale; not useful without temporal modeling |
    | sqft_basement | Highly correlated with sqft_living and sqft_above       |
    | yr_renovated  | Mostly zeros; sparse and not informative                |

  These features either introduced noise, redundancy, or lacked meaningful variance. Dropping them improved model interpretability and reduced overfitting risk.


## 📊 Dataset
  The dataset contains housing features and sale prices. Key input features include:
    - bedrooms, bathrooms, floors, waterfront, view, condition, grade
    - yr_built, lat, long, sqft_living, sqft_lot, zipcode, etc.
    - price (target variable)


## 🧠 Models Trained

  | Model             | R² Score | RMSE       | MAE        | Best Parameters |
  |-------------------|----------|------------|------------|-----------------|
  | Linear Regression | 0.634    | 222,106    | 134,890    |        —        |
  | Decision Tree  | 0.780    | 172,272    | 90,299     | max_depth=10, min_samples_split=20 |
  | Random Forest     | 0.884    | 125,005    | 71,291     | n_estimators=100, max_depth=None, min_samples_split=5 |
  | SVM               | 0.505    | 258,194    | 135,032    | C=10, kernel=linear, gamma=scale |
  | XGBoost           | 0.867    | 133,653    | 71,808     | learning_rate=0.05, max_depth=6, n_estimators=200, subsample=1.0 |
  | Neural Network    | 0.882    | 125,841    | 75,333     | activation=relu, hidden_layer_sizes=(64,64), learning_rate_init=0.005 |


## 🏆 Best Performing Model
  Random Forest Regressor

## 🛠️ Setup Instructions
  Must follow all steps in order. 3 terminal windows will be used here.
    1. Install Dependencies
    2. Run Training Script
    3. Run Backend Script
    4. Run UI Script
