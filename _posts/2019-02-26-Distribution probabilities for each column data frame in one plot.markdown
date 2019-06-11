Distribution probabilities for each column data frame, in one plot


#### Loop over columns:

```
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.DataFrame(np.random.randn(14,5), columns=list("ABCDE"))

fig, axes = plt.subplots(ncols=5)
for ax, col in zip(axes, df.columns):
    sns.distplot(df[col], ax=ax)

plt.show()
```


#### Melt dataframe

```
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.DataFrame(np.random.randn(14,5), columns=list("ABCDE"))

g = sns.FacetGrid(df.melt(), col="variable")
g.map(sns.distplot, "value")

plt.show()
```