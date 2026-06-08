<div align="center">

# `GYMTOPIA` — NEXT-GEN GYM OS
## Object-Oriented Programming Portfolio

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=24&pause=800&color=CC0000&center=true&vCenter=true&width=700&lines=UET+Lahore+%7C+BS+Computer+Science;Lifting+Weights+%26+Pointers+Since+2026;4+Sets+of+12+Reps+of+Garbage+Collection;Instantiating+Gainz+in+C%23+%26+React;Muhammad+Uwais+Baig" alt="Gymtopia Typing Banner" />

<img align="right" alt="Coding" width="300" src="https://raw.githubusercontent.com/UwaisBaig/GymTopia---Gym-Managemnet-System/main/assets/gym-workout.gif">

</div>

### About Gymtopia

This repository is a fully functional Gym Management System developed for my OOP coursework at UET Lahore. It features a complete React-based GUI console alongside a mirroring C# core implementation, designed to demonstrate encapsulation, inheritance, and dynamic polymorphism.

Instead of generic scripts, Gymtopia bridges real-world business logic (member registry, billing status, check-in logs, and consistency tracking) with structured software design patterns.

<br clear="right"/>

---

### The Core Architecture (OOP Blueprint)

Our architecture revolves around real-world objects and strict inheritance hierarchies:

```csharp
// Base blueprint representing any person interacting with Gymtopia
public class Person 
{
    private string _id; // Encapsulation: Access restricted to getters
    protected string Name; 
    public string Phone { get; }

    public virtual string ToString() => $"Person: {Name} (ID: {_id})";
}

// Specialization of Person with gym membership mechanics
public class Member : Person 
{
    private string _feeStatus; // Paid / Unpaid
    public string Package { get; set; } 
    public List<DateTime> CheckInLogs { get; }

    // Polymorphism: Overriding the baseline string conversion
    public override string ToString() 
    {
        return $"Member: {Name} | Package: {Package} | Consistency: {GetConsistency()}%";
    }

    public double GetConsistency() 
    {
        // Consistency is computed dynamically based on monthly logs
        return (CheckInLogs.Count / 30.0) * 100;
    }
}
```

---

### Gym Member Status vs Compiler Logs

| Scenario | Gym Attendant Actions | Compiler Reactions |
|---|---|---|
| Member cancels membership | "Let me remove you from our storage list." | `NullReferenceException: Member profile not found.` |
| Member skips leg day | "Please update your trainer schedule." | `Warning: Infinite loop detected in SquatRoutine.` |
| Member pays monthly fee | "Your status is now updated to Paid." | `GarbageCollector: Freed up 3000 bytes of pending dues.` |

---

### Developer Fitness Log (`oop-humor.json`)

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

### 🚀 Local Setup

To run the React dashboard locally on your machine:

1. Clone the repository:
   ```bash
   git clone https://github.com/UwaisBaig/GymTopia---Gym-Managemnet-System.git
   ```
2. Enter the directory and install dependencies:
   ```bash
   cd GymTopia---Gym-Managemnet-System
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
