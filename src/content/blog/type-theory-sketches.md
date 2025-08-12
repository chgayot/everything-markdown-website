---
title: "Sketches in Type Theory"
slug: "type-theory-sketches"
description: "Informal explorations of type systems, their beauty, and their practical implications in everyday programming."
date: "2025-08-04"
category: "theory"
keywords:
  - types
  - theory
  - functional programming
  - mathematics
draft: false
---

# The Geometry of Types

Types are not merely constraints - they are the geometric foundations upon which we build our logical structures.

## Union Types: The Art of Possibility

A union type is a declaration of potential, a way of saying "this value could be one of several things, and that's perfectly acceptable."

```typescript
type Measurement = 
  | { unit: 'metric'; value: number }
  | { unit: 'imperial'; value: number }
  | { unit: 'relative'; value: string };
```

## The Curry-Howard Correspondence

In this beautiful relationship between logic and computation, every type corresponds to a proposition, and every program corresponds to a proof.

When we write:
```haskell
map :: (a -> b) -> [a] -> [b]
```

We're not just describing a function - we're stating a logical theorem about the transformation of collections.

## Types as Documentation

The most honest documentation is the type signature. It cannot lie, cannot become outdated, and serves as a contract between the programmer's intention and the machine's execution.

In TypeScript, we write our intentions first, then implement them. This inversion - types before implementation - mirrors the mathematical practice of stating theorems before proving them.

## Dependent Types: The Future Beckons

In languages with dependent types, the distinction between compile-time and runtime begins to blur. Types can depend on values, creating a rich language for expressing precise specifications.

Though not yet mainstream, these concepts will likely reshape how we think about correctness in software.