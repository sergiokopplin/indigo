https://stackoverflow.com/questions/21702342/creating-a-new-column-based-on-if-elif-else-condition

row_indexes=df[df['age']>=50].index

step 2: Using .loc we can assign a new value to column

df.loc[row_indexes,'elderly']="yes"

same for age below less than 50

row_indexes=df[df['age']<50].index

df[row_indexes,'elderly']="no"
