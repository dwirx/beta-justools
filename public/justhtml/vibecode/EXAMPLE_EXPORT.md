# Contoh Export Chat

**Exported:** 08/01/2026, 14:30:00

---

## 👤 User

Tolong buatkan fungsi untuk menghitung faktorial

---

## 🤖 Assistant

Tentu! Berikut adalah fungsi untuk menghitung faktorial dalam beberapa bahasa pemrograman:

### JavaScript

```javascript
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

// Iterative version
function factorialIterative(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}
```

### Python

```python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

# Using math module
import math
result = math.factorial(5)  # 120
```

Fungsi di atas menggunakan pendekatan rekursif. Untuk angka besar, pendekatan iteratif lebih efisien karena tidak membebani call stack.

<sub>📊 Claude Sonnet 4.5 • Tokens: 45/280 • Cost: $0.00054</sub>

---

## 👤 User

Bagaimana cara mengoptimalkan untuk angka yang sangat besar?

---

## 🤖 Assistant

<details>
<summary>💭 Thinking Process</summary>

```
User asking about optimization for very large numbers. Should consider:
1. Memoization/caching
2. Using BigInt for JavaScript
3. Tail recursion optimization
4. Mathematical approximations like Stirling's formula
```

</details>

Untuk angka sangat besar, ada beberapa optimasi yang bisa dilakukan:

### 1. Memoization

```javascript
const factorialMemo = (() => {
    const cache = new Map([[0, 1], [1, 1]]);

    return function factorial(n) {
        if (cache.has(n)) return cache.get(n);

        const result = BigInt(n) * factorial(n - 1);
        cache.set(n, result);
        return result;
    };
})();
```

### 2. Menggunakan BigInt

```javascript
function factorialBigInt(n) {
    let result = 1n;
    for (let i = 2n; i <= BigInt(n); i++) {
        result *= i;
    }
    return result;
}

console.log(factorialBigInt(100));
```

### 3. Stirling's Approximation

Untuk estimasi cepat tanpa perhitungan eksak:

```javascript
function factorialApprox(n) {
    if (n < 20) return factorial(n);
    return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
}
```

**Perbandingan:**
- Memoization: Bagus untuk perhitungan berulang
- BigInt: Wajib untuk n > 20
- Stirling: Cepat tapi hasil approximasi

<sub>📊 Claude Sonnet 4.5 • Tokens: 78/520 • Cost: $0.00101</sub>

---
