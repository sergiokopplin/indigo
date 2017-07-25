# Pandas Cookbook

A collection of code blocks to perform useful `pandas` functions.

# Sort a DataFrame by multiple columns

Use the `sort_values` method of DataFrames.

```
df.sort_values(['a', 'b'], ascending=[True, False])
```

[Credit](https://stackoverflow.com/questions/17141558/how-to-sort-a-dataframe-in-python-pandas-by-two-or-more-columns)

# Check if rows are equal to an array-like vector

Given an array-like vector `v` with same dimensionality as rows in a DataFrame `df`, check which rows in `df` are equal to `v`.

```
df = pd.DataFrame([[0,1],[2,3],[4,5]], columns=['A', 'B'])
v = np.array([0,1])
(df == v).all(1) # checks for boolean True across columns
```

[Credit](https://stackoverflow.com/questions/24761133/pandas-check-if-row-exists-with-certain-values)
