In this project, I built and trained logistic regression model using TensorFlow, PyTorch and Scikit-Learn library. This project has large league of legends dataset with 9 columns and 1000 rows. win is the target feature and kills, deaths, assists, gold-earned, cs, wards_placed, wards_killed, damage_dealt are input features.

## Introduction
  League of Legends, a popular multiplayer online battle arena (MOBA) game, generates extensive data from matches, providing an excellent opportunity to apply machine learning techniques to real-world scenarios. Performed the following steps to build a logistic regression model aimed at predicting the outcomes of League of Legends matches.

## Dataset
  Sample from the dataset:

  | win	| kills	| deaths | assists | gold_earned | cs	 | wards_placed | wards_killed | damage_dealt |
  | --- | ----- | ------ | ------- | ----------- | --- | ------------ | ------------ | ------------ |
  | 0	  |  16	  |    6	 |   19	   |    17088	   | 231 |      11	    |       7	     |     15367    |
  | 1	  |   8	  |    8	 |    5	   |    14865	   | 259 |      10	    | 	    2		   |     38332    |
  | 0	  |   0	  |   17   |   11	   |    15919	   | 169 |      14	    | 	    5		   |     24642    |
  | 0		|  19 	|   11	 |    1	   |    11534	   | 264 |      14		  | 	    3		   |     15789    |
  | 0		|  12 	|    7	 |    6    |    18926	   | 124 |      15		  | 	    7		   |     40268    |
  | 1		|  15	  |    7	 |    5	   |    19245	   | 70  |       9		  | 	    5		   |     25950    |
  | 0		|  12	  |   17	 |    2	   |     8156	   | 221 |      11		  | 	    7		   |     30563    |
  | 0		|  13	  |   19   |   12	   |    16580	   | 182 |      12		  | 	    0		   |     44649    |
  | 0		|   2	  |   14	 |    2	   |     9307	   | 136 |       3		  | 	    5		   |     41404    |


## Following steps are performed in the project
  - Step 1: Load the League of Legends dataset and preprocess it for training
  - Step 2: Implement a logistic regression model using PyTorch
  - Step 3: Train the logistic regression model on the dataset
  - Step 4: Implement optimization techniques and evaluate the model's performance
  - Step 5: Visualization and Interpretation
  - Step 6: Save and load the trained model
  - Step 7: Perform hyperparameter tuning to find the best learning rate
  - Step 8: Evaluate feature importance to understand the impact of each feature on the prediction


#### This project was written as part of IBM's Intro to NN and PyTorch course found on [Coursera](https://www.coursera.org/learn/deep-neural-networks-with-pytorch/).
