// // Expense Calculator Page
// // Helps students split/calculate shared PG expenses
// // URL: /expenses
// function ExpenseCalculator() {
//   return (
//     <h1>Expense Calculator Page</h1>
//   );
// }

// export default ExpenseCalculator;

// src/pages/ExpenseCalculator/ExpenseCalculator.jsx

import { useState } from "react";

import {
  HiOutlineCalculator,
  HiOutlineHome,
  HiOutlineCake,
  HiOutlineBolt,
  HiOutlineGlobeAlt,
  HiOutlineTruck,
  HiOutlineWallet,
  HiOutlineArrowPath,
} from "react-icons/hi2";

function ExpenseCalculator() {
  // ---------- Expense State ----------
  // All expenses are stored in one object to keep the component simple.
  const [expenses, setExpenses] = useState({
    rent: "",
    food: "",
    electricity: "",
    internet: "",
    transport: "",
    other: "",
  });

  // Stores the calculated result after clicking Calculate
  const [result, setResult] = useState(null);

  // ---------- Expense Categories ----------
  // Each category contains its label, icon and input field name.
  const expenseCategories = [
    {
      key: "rent",
      label: "PG Rent",
      placeholder: "e.g. 7500",
      icon: <HiOutlineHome />,
    },
    {
      key: "food",
      label: "Food & Meals",
      placeholder: "e.g. 2500",
      icon: <HiOutlineCake />,
    },
    {
      key: "electricity",
      label: "Electricity",
      placeholder: "e.g. 800",
      icon: <HiOutlineBolt />,
    },
    {
      key: "internet",
      label: "Internet",
      placeholder: "e.g. 500",
      icon: <HiOutlineGlobeAlt />,
    },
    {
      key: "transport",
      label: "Transport",
      placeholder: "e.g. 1000",
      icon: <HiOutlineTruck />,
    },
    {
      key: "other",
      label: "Other Expenses",
      placeholder: "e.g. 1000",
      icon: <HiOutlineWallet />,
    },
  ];

  // ---------- Handle Input Change ----------
  const handleChange = (field, value) => {
    setExpenses({
      ...expenses,
      [field]: value,
    });

    // Clear old result when user changes an expense
    setResult(null);
  };

  // ---------- Calculate Expenses ----------
  const calculateExpenses = () => {
    const rent = Number(expenses.rent) || 0;
    const food = Number(expenses.food) || 0;
    const electricity = Number(expenses.electricity) || 0;
    const internet = Number(expenses.internet) || 0;
    const transport = Number(expenses.transport) || 0;
    const other = Number(expenses.other) || 0;

    const total = rent + food + electricity + internet + transport + other;

    const yearlyTotal = total * 12;

    setResult({
      total,
      yearlyTotal,
      breakdown: {
        rent,
        food,
        electricity,
        internet,
        transport,
        other,
      },
    });
  };

  // ---------- Reset Calculator ----------
  const resetCalculator = () => {
    setExpenses({
      rent: "",
      food: "",
      electricity: "",
      internet: "",
      transport: "",
      other: "",
    });

    setResult(null);
  };

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ---------- Page Header ---------- */}

        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center">
            <div className="bg-blue-50 text-blue-600 rounded-full p-3">
              <HiOutlineCalculator className="text-3xl" />
            </div>
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
            Student Expense Calculator
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Estimate your monthly and yearly living expenses before choosing
            your PG.
          </p>
        </div>

        {/* ---------- Calculator Card ---------- */}

        <div className="mt-10 border border-gray-200 rounded-xl p-6 md:p-8">

          <h2 className="text-xl font-semibold text-gray-900">
            Enter Your Monthly Expenses
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Enter an approximate amount for each category.
          </p>

          {/* ---------- Expense Inputs ---------- */}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {expenseCategories.map((category) => (
              <div key={category.key}>

                {/* Label */}

                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span className="text-blue-600 text-lg">
                    {category.icon}
                  </span>

                  {category.label}
                </label>

                {/* Input */}

                <div className="mt-2 relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={expenses[category.key]}
                    onChange={(e) =>
                      handleChange(category.key, e.target.value)
                    }
                    placeholder={category.placeholder}
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-3 outline-none focus:border-blue-500 transition-colors"
                  />

                </div>

              </div>
            ))}

          </div>

          {/* ---------- Action Buttons ---------- */}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">

            <button
              onClick={calculateExpenses}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <HiOutlineCalculator className="text-lg" />
              Calculate Total
            </button>

            <button
              onClick={resetCalculator}
              className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <HiOutlineArrowPath className="text-lg" />
              Reset
            </button>

          </div>

        </div>

        {/* ---------- Result Section ---------- */}

        {result && (
          <div className="mt-10">

            {/* Main Total */}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">

              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Estimated Monthly Expense
              </p>

              <p className="mt-2 text-4xl md:text-5xl font-bold text-blue-600">
                ₹{result.total.toLocaleString("en-IN")}
              </p>

              <p className="mt-3 text-gray-600">
                Estimated yearly expense:{" "}
                <span className="font-semibold text-gray-900">
                  ₹{result.yearlyTotal.toLocaleString("en-IN")}
                </span>
              </p>

            </div>

            {/* ---------- Expense Breakdown ---------- */}

            <div className="mt-8 border border-gray-200 rounded-xl p-6 md:p-8">

              <h2 className="text-xl font-semibold text-gray-900">
                Expense Breakdown
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Here's how your estimated monthly budget is distributed.
              </p>

              <div className="mt-6 space-y-4">

                {expenseCategories.map((category) => {
                  const amount = result.breakdown[category.key];

                  return (
                    <div
                      key={category.key}
                      className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
                    >

                      <div className="flex items-center gap-3">

                        <span className="text-blue-600 text-xl">
                          {category.icon}
                        </span>

                        <span className="text-gray-700 text-sm">
                          {category.label}
                        </span>

                      </div>

                      <span className="font-semibold text-gray-900">
                        ₹{amount.toLocaleString("en-IN")}
                      </span>

                    </div>
                  );
                })}

              </div>

              {/* Total Row */}

              <div className="mt-5 pt-5 border-t border-gray-200 flex items-center justify-between">

                <span className="font-semibold text-gray-900">
                  Total Monthly Expense
                </span>

                <span className="text-xl font-bold text-blue-600">
                  ₹{result.total.toLocaleString("en-IN")}
                </span>

              </div>

            </div>

            {/* ---------- Budget Tip ---------- */}

            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">

              <h3 className="font-semibold text-gray-900">
                Budget Planning Tip
              </h3>

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Comparing your estimated monthly expenses with different PG
                options can help you understand your overall student living
                budget before making a decision.
              </p>

            </div>

          </div>
        )}

        {/* ---------- Information Section ---------- */}

        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6">

          <div className="flex items-start gap-4">

            <HiOutlineCalculator className="text-blue-600 text-2xl flex-shrink-0 mt-1" />

            <div>

              <h3 className="font-semibold text-gray-900">
                Plan Your Student Budget
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                This calculator provides an estimated view of your living
                expenses based on the amounts you enter. Actual expenses may
                vary depending on your lifestyle and accommodation.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ExpenseCalculator;