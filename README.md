<div align="center">

# 🏋️‍♂️ `GYMTOPIA` — NEXT-GEN GYM OS
### *“Leg Day is Optional. Compiling is Not.”*

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=24&pause=800&color=CC0000&center=true&vCenter=true&width=700&lines=UET+Lahore+%7C+BS+Computer+Science;Lifting+Weights+%26+Pointers+Since+2026;4+Sets+of+12+Reps+of+Garbage+Collection;Instantiating+Gainz+in+C%23+%26+React;Roll+No%3A+2025-CS-531+%7C+Muhammad+Uwais+Baig" alt="Gymtopia Typing Banner" />

[![Tech Stack](https://img.shields.io/badge/Stack-C%23%20%7C%20React%20%7C%20Vite-CC0000?style=for-the-badge)](https://github.com/UwaisBaig/GymTopia---Gym-Managemnet-System)
[![OOP Course](https://img.shields.io/badge/Course-Object--Oriented%20Programming-black?style=for-the-badge&logo=dotnet)](https://github.com/UwaisBaig/GymTopia---Gym-Managemnet-System)

---

</div>

### 🚨 System Diagnostic: The Attendant vs. The Compiler
```
[ATTENDANT] -> "Sir, a member wants to cancel their Gold membership."
[COMPILER]  -> "InvalidOperationException: Member consistency index is already 100%."
[ATTENDANT] -> "But they aren't paying their dues!"
[COMPILER]  -> "Garbage Collector has locked the target. Please wait..."
```

---

### 🧠 The Core Architecture (OOP Blueprint)

The Gymtopia ecosystem is powered by clean hierarchical domain models structured to enforce solid software engineering principles. Below is the active layout running under the hood:

```csharp
// Base Blueprint for all Humans entering the Gymtopia Zone
public class Person 
{
    private string _id;          // Encapsulated Key
    protected string Name;       // Inherited Identifier
    public string Phone { get; } // Read-Only Property
    
    public virtual string ToString() => $"[Person] {Name} (ID: {_id})";
}

// Specialization: The Gym Warrior
public class Member : Person 
{
    private double _monthlyFeeStatus; 
    public string Package { get; set; } // "Silver", "Gold", or "Premium"
    public List<DateTime> CheckInLogs { get; }

    // Dynamic Polymorphism: Overriding baseline representation
    public override string ToString() 
    {
        return $"[Member] {Name} | Package: {Package} | Consistency: {GetConsistency()}%";
    }

    public double GetConsistency() 
    {
        // Internal business logic: calculates attendance consistency metrics
        return (CheckInLogs.Count / 30.0) * 100;
    }
}
```

---

### 🛠️ Hardware & Software Modules

Our custom GUI features twin command center layouts built for high performance:

*   🔴 **The Widescreen Command Center (`1250px` Canvas)**: Re-engineered layout giving the admin and attendant full grid visibility.
*   🔴 **High-Power Login Terminal**: Featuring a vertically stacked `84px` emblem badge and aggressive red typography branding.
*   🔴 **Input-State Continuity Fix**: Custom layout routing that keeps form elements focused, allowing fluid high-speed entries.
*   🔴 **Local Persistence Engine**: Real-time storage serialization ensuring no member logs, complaints, or dues are dropped on crash.

---

### 🧬 Developer Fitness Log (`oop-humor.json`)

```json
{
  "routine": {
    "Monday": "Chest Day && Branch Merging",
    "Wednesday": "Squats && Resolving NullPointerExceptions",
    "Friday": "Deadlifts && Garbage Collection Curls"
  },
  "dietary_macros": {
    "protein": "Whey Isolate",
    "energy": "Dark Roast Coffee && Raw Assembly Code"
  },
  "rules": [
    "Never skip leg day.",
    "Never push directly to production main.",
    "Do 3 sets of 15 code refactors daily."
  ]
}
```

---

### ⚙️ How to Boot the System

1.  **Clone & Access System**:
    ```bash
    git clone https://github.com/UwaisBaig/GymTopia---Gym-Managemnet-System.git
    cd GymTopia---Gym-Managemnet-System
    ```
2.  **Install Engine dependencies**:
    ```bash
    npm install
    ```
3.  **Boot Dev Host**:
    ```bash
    npm run dev
    ```
