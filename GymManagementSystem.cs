using System;
using System.Collections.Generic;

namespace Gymtopia
{
    // =========================================================================
    // OOP CONCEPT 1: ENCAPSULATION & DATA HIDING
    // Private member variables represent the state of the object, which cannot be accessed directly.
    // They are instead exposed via read-only Properties (getters) to ensure integrity.
    // =========================================================================
    public class Person
    {
        private int _id;
        private string _name;
        private int _age;
        private string _phone;

        // Constructor to initialize state
        public Person(int id, string name, int age, string phone)
        {
            _id = id;
            _name = name;
            _age = age;
            _phone = phone;
        }

        // Encapsulated Properties (Read-Only accessors)
        public int Id => _id;
        public string Name => _name;
        public int Age => _age;
        public string Phone => _phone;

        // =========================================================================
        // OOP CONCEPT 2: VIRTUAL METHOD (Dynamic Polymorphism hook)
        // By marking this method as 'virtual', we allow subclasses to override it
        // at runtime based on the actual object instance type.
        // =========================================================================
        public virtual string ToStringRepresentation()
        {
            return $"Person: {_name} (ID: {_id})";
        }
    }

    // =========================================================================
    // OOP CONCEPT 3: INHERITANCE
    // 'Member' extends the 'Person' base class. It inherits all properties of Person (ID, Name, Age, Phone)
    // while defining specialized domain properties for gym memberships (package, fee status, trainer, check-in history).
    // =========================================================================
    public class Member : Person
    {
        private string _package;
        private int _fee;
        private string _feeStatus;
        private string _trainer;
        private List<string> _checkIns;

        // Constructor uses the base keyword to propagate name, age, and phone up to the Person constructor
        public Member(int id, string name, int age, string phone, string pkg, int fee, string feeStatus, string trainer, List<string> checkIns)
            : base(id, name, age, phone)
        {
            _package = pkg;
            _fee = fee;
            _feeStatus = feeStatus;
            _trainer = trainer;
            _checkIns = checkIns ?? new List<string>();
        }

        // Subclass-specific Properties
        public string Package => _package;
        public int Fee => _fee;
        public string FeeStatus
        {
            get => _feeStatus;
            set => _feeStatus = value; // Setter allowed to change fee status dynamically
        }
        public string Trainer => _trainer;
        public List<string> CheckIns => _checkIns;

        // =========================================================================
        // OOP CONCEPT 4: DYNAMIC POLYMORPHISM (Method Overriding)
        // By using the 'override' keyword, we redefine the 'ToStringRepresentation' virtual method.
        // If a list contains Person pointers/references pointing to Member objects, calling
        // 'ToStringRepresentation()' dynamically resolves to this subclass implementation at runtime.
        // =========================================================================
        public override string ToStringRepresentation()
        {
            string trainerPart = string.IsNullOrEmpty(_trainer) ? "" : $" | Trainer: {_trainer}";
            return $"Member: {Name} | {_package} | Rs. {_fee} | {_feeStatus}{trainerPart}";
        }

        // Helper business logic: calculates check-in consistency percentage
        public int GetConsistency()
        {
            DateTime now = DateTime.Now;
            int daysPassed = now.Day;

            int checkInsThisMonth = 0;
            foreach (var dateStr in _checkIns)
            {
                if (DateTime.TryParse(dateStr, out DateTime dt))
                {
                    if (dt.Month == now.Month && dt.Year == now.Year)
                    {
                        checkInsThisMonth++;
                    }
                }
            }

            if (daysPassed == 0) return 0;
            return (int)Math.Round(((double)checkInsThisMonth / daysPassed) * 100);
        }
    }

    // =========================================================================
    // Complaint Class
    // =========================================================================
    public class Complaint
    {
        private int _id;
        private string _text;
        private DateTime _timestamp;

        public Complaint(int id, string text, DateTime timestamp)
        {
            _id = id;
            _text = text;
            _timestamp = timestamp;
        }

        public int Id => _id;
        public string Text => _text;
        public DateTime Timestamp => _timestamp;
        public string TimeString => _timestamp.ToString("g");
    }
}
