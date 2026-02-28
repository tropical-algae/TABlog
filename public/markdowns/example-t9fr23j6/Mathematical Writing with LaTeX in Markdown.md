- created_time: 2026-2-28
- tags: example
- tags: case
- tags: latex

---

Many university and graduate-level topics require mathematical notation. Markdown combined with LaTeX syntax allows precise expression of complex ideas.

## Inline Mathematics

We can write inline formulas like $O(n \log n)$ to describe algorithm complexity.

The definition of the Euclidean norm of a vector $x \in \mathbb{R}^n$ is  
$x = (x_1, x_2, \dots, x_n)$ and $|x|_2 = \sqrt{\sum_{i=1}^{n} x_i^2}$.

```
$x = (x_1, x_2, \dots, x_n)$
$|x|_2 = \sqrt{\sum_{i=1}^{n} x_i^2}$
```

## Multi-Line Equation

For example, consider linear regression. The closed-form solution is:

$$
\hat{\beta} = (X^T X)^{-1} X^T y
$$

```
$$
\hat{\beta} = (X^T X)^{-1} X^T y
$$
```

where:
- $X$ is the design matrix
- $y$ is the target vector
- $\hat{\beta}$ is the estimated parameter vector

## Optimization Example

In machine learning, we often minimize a loss function:

$$
\min_{\theta} \; \frac{1}{n} \sum_{i=1}^{n} \ell(f_{\theta}(x_i), y_i)
$$

If $\ell$ is the squared loss, then:

$$
\ell(\hat{y}, y) = (\hat{y} - y)^2
$$

## Probability Theory

The expectation of a random variable $X$ is defined as:

$$
\mathbb{E}[X] = \int_{-\infty}^{\infty} x f(x) dx
$$
```
$$
\mathbb{E}[X] = \int_{-\infty}^{\infty} x f(x) dx
$$
```

In graduate-level statistics and machine learning, such expressions are essential for clarity and rigor.

By supporting both inline `$...$` and block `$$...$$` syntax, your Markdown blog becomes suitable for academic, research, and highly technical writing.