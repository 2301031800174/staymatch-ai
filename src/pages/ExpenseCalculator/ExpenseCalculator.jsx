// src/pages/ExpenseCalculator/ExpenseCalculator.jsx

import { useState, useEffect } from "react";
import {
  HiOutlineHome,
  HiOutlineCake,
  HiOutlineBolt,
  HiOutlineWifi,
  HiOutlineTruck,
  HiOutlineSquares2X2,
  HiOutlineCalculator,
  HiOutlineUserGroup,
  HiOutlineInformationCircle,
} from "react-icons/hi2";

// localStorage key where the inputs are saved (browser only, not MongoDB)
const STORAGE_KEY = "staymatch_expense_calculator";

// Largest amount allowed in one category (₹10,00,000 per month)
const MAX_AMOUNT = 1000000;

// Largest number of people allowed to share the expenses
const MAX_PEOPLE = 20;

// ---------- Expense categories ----------
const categories = [
  { key: "rent", label: "PG Rent", icon: <HiOutlineHome /> },
  { key: "food", label: "Food & Meals", icon: <HiOutlineCake /> },
  { key: "electricity", label: "Electricity", icon: <HiOutlineBolt /> },
  { key: "internet", label: "Internet", icon: <HiOutlineWifi /> },
  { key: "transport", label: "Transport", icon: <HiOutlineTruck /> },
  { key: "other", label: "Other Expenses", icon: <HiOutlineSquares2X2 /> },
];

// Inputs are kept as text so we can tell "empty" apart from "0" or "abc"
const emptyInputs = {
  rent: "",
  food: "",
  electricity: "",
  internet: "",
  transport: "",
  other: "",
};

// ---------- Helpers ----------

// Format a number in Indian style, e.g. 150000 -> "₹1,50,000"
const formatCurrency = (amount) =>
  "₹" +
  Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

// Round to 2 decimal places to avoid floating point noise (e.g. 0.1 + 0.2)
const roundMoney = (value) => Math.round(value * 100) / 100;

// Check one expense input. Empty is allowed and counts as 0.
// Returns an error message, or "" if the value is fine.
const validateAmount = (text) => {
  const value = text.trim();
  if (value === "") return "";

  if (value.startsWith("-")) {
    return "Amount cannot be negative.";
  }
  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    return "Enter a valid amount using digits only (up to 2 decimal places).";
  }
  if (Number(value) > MAX_AMOUNT) {
    return `Amount cannot be more than ${formatCurrency(MAX_AMOUNT)}.`;
  }
  return "";
};

// Check the number of people (whole number from 1 to MAX_PEOPLE)
const validatePeople = (text) => {
  const value = text.trim();
  if (value === "") return "Enter the total number of people sharing.";
  if (!/^\d+$/.test(value)) return "Enter a whole number (for example 1, 2 or 3).";

  const count = Number(value);
  if (count < 1) return "At least 1 person is required.";
  if (count > MAX_PEOPLE) return `Number of people cannot be more than ${MAX_PEOPLE}.`;
  return "";
};

// ---------- Load saved data safely ----------
const loadSavedData = () => {
  const fallback = { inputs: { ...emptyInputs }, people: "1" };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return fallback;

    // Keep only known fields, and only if they are text
    const inputs = { ...emptyInputs };
    if (parsed.inputs && typeof parsed.inputs === "object") {
      categories.forEach((category) => {
        if (typeof parsed.inputs[category.key] === "string") {
          inputs[category.key] = parsed.inputs[category.key];
        }
      });
    }

    const people = typeof parsed.people === "string" ? parsed.people : "1";
    return { inputs, people };
  } catch (error) {
    return fallback;
  }
};

function ExpenseCalculator() {
  // ---------- State ----------
  const [inputs, setInputs] = useState(() => loadSavedData().inputs);
  const [people, setPeople] = useState(() => loadSavedData().people);
  const [errors, setErrors] = useState({}); // error message per field
  const [result, setResult] = useState(null); // stays null until "Calculate Total"

  // ---------- Save to localStorage whenever the inputs change ----------
  // This also covers Reset, because Reset puts the empty values back into state.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs, people }));
    } catch (error) {
      // Storage may be full or blocked - the calculator still works without saving
    }
  }, [inputs, people]);

  // ---------- Handlers ----------
  const handleInputChange = (key, value) => {
    setInputs({ ...inputs, [key]: value });
    setErrors({ ...errors, [key]: "" });
    setResult(null); // old result would be outdated now
  };

  const handlePeopleChange = (value) => {
    setPeople(value);
    setErrors({ ...errors, people: "" });
    setResult(null);
  };

  const handleCalculate = () => {
    // 1. Validate every field
    const newErrors = {};
    categories.forEach((category) => {
      const message = validateAmount(inputs[category.key]);
      if (message) newErrors[category.key] = message;
    });
    const peopleMessage = validatePeople(people);
    if (peopleMessage) newErrors.people = peopleMessage;

    setErrors(newErrors);

    // 2. Stop if anything is invalid - we never silently treat bad values as 0
    if (Object.keys(newErrors).length > 0) {
      setResult(null);
      return;
    }

    // 3. Empty inputs count as 0
    const amounts = categories.map((category) => ({
      key: category.key,
      label: category.label,
      amount: inputs[category.key].trim() === "" ? 0 : Number(inputs[category.key]),
    }));

    // 4. Household total first, THEN divide by the number of people
    const householdMonthly = roundMoney(
      amounts.reduce((sum, item) => sum + item.amount, 0)
    );
    const peopleCount = Number(people);
    const perPersonMonthly = roundMoney(householdMonthly / peopleCount);
    const perPersonYearly = roundMoney(perPersonMonthly * 12);
    const householdYearly = roundMoney(householdMonthly * 12);

    // 5. Share of the total for each category (0 when the total is 0)
    const breakdown = amounts.map((item) => ({
      ...item,
      percentage:
        householdMonthly > 0
          ? Math.round((item.amount / householdMonthly) * 1000) / 10
          : 0,
    }));

    // 6. Biggest category (only meaningful when there is some spending)
    let biggest = null;
    if (householdMonthly > 0) {
      biggest = breakdown.reduce((max, item) =>
        item.amount > max.amount ? item : max
      );
    }

    setResult({
      householdMonthly,
      householdYearly,
      perPersonMonthly,
      perPersonYearly,
      peopleCount,
      breakdown,
      biggest,
    });
  };

  const handleReset = () => {
    setInputs({ ...emptyInputs });
    setPeople("1");
    setErrors({});
    setResult(null);
  };

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ---------- Page Header ---------- */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Monthly Expense Calculator
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Estimate your monthly living costs before choosing a PG.
          </p>
        </div>

        {/* ---------- Input Card ---------- */}
        <div className="mt-10 border border-gray-200 rounded-xl p-6 md:p-8">

          <h2 className="text-lg font-semibold text-gray-900">
            Household Expenses (per month)
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter the total amount in ₹ for the whole household. Fields left
            empty are counted as ₹0.
          </p>

          {/* Expense fields */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {categories.map((category) => (
              <div key={category.key}>
                <label
                  htmlFor={category.key}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <span className="text-blue-600 text-lg">{category.icon}</span>
                  {category.label}
                </label>

                <div
                  className={`mt-1 flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
                    errors[category.key] ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <span className="text-gray-500 mr-2">₹</span>
                  <input
                    id={category.key}
                    type="text"
                    inputMode="decimal"
                    value={inputs[category.key]}
                    onChange={(e) => handleInputChange(category.key, e.target.value)}
                    placeholder="0"
                    aria-invalid={Boolean(errors[category.key])}
                    aria-describedby={
                      errors[category.key] ? `${category.key}-error` : undefined
                    }
                    className="w-full py-2 outline-none text-gray-700"
                  />
                </div>

                {errors[category.key] && (
                  <p
                    id={`${category.key}-error`}
                    className="mt-1 text-xs text-red-600"
                  >
                    {errors[category.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Number of people */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <label
              htmlFor="people"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <span className="text-blue-600 text-lg">
                <HiOutlineUserGroup />
              </span>
              Number of Roommates (total people sharing)
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Count everyone, including yourself. Enter 2 if two people in total
              share the expenses, not two extra roommates.
            </p>

            <input
              id="people"
              type="text"
              inputMode="numeric"
              value={people}
              onChange={(e) => handlePeopleChange(e.target.value)}
              aria-invalid={Boolean(errors.people)}
              aria-describedby={errors.people ? "people-error" : undefined}
              className={`mt-2 w-full sm:w-40 border rounded-lg px-3 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.people ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.people && (
              <p id="people-error" className="mt-1 text-xs text-red-600">
                {errors.people}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <HiOutlineCalculator />
              Calculate Total
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            >
              Reset
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Your inputs are saved only in this browser (localStorage). They are
            not sent to the server or database.
          </p>
        </div>

        {/* ---------- Results ---------- */}
        {result && (
          <div className="mt-10">

            {/* Totals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border border-blue-100 bg-blue-50 rounded-xl p-6">
                <p className="text-sm font-medium text-blue-600">
                  Total Monthly Household Expenses
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatCurrency(result.householdMonthly)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Yearly estimate: {formatCurrency(result.householdYearly)}
                </p>
              </div>

              <div className="border border-blue-100 bg-blue-50 rounded-xl p-6">
                <p className="text-sm font-medium text-blue-600">
                  Estimated Monthly Expense Per Person
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatCurrency(result.perPersonMonthly)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Estimated yearly per person:{" "}
                  {formatCurrency(result.perPersonYearly)}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Per person = total household expenses ÷ {result.peopleCount}{" "}
              {result.peopleCount === 1 ? "person" : "people"}. Yearly = monthly
              × 12.
            </p>

            {/* Breakdown */}
            <div className="mt-8 border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900">
                Expense Breakdown
              </h3>

              <div className="mt-4 space-y-4">
                {result.breakdown.map((item) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-800">
                        {item.label}
                      </span>
                      <span className="text-gray-600">
                        {formatCurrency(item.amount)} · {item.percentage}%
                      </span>
                    </div>

                    <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget planning information */}
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
              <HiOutlineInformationCircle className="text-blue-600 text-2xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Budget Planning</h3>

                {result.householdMonthly === 0 ? (
                  <p className="mt-1 text-sm text-gray-600">
                    All amounts are ₹0 right now. Enter your expected costs to
                    see a budget estimate.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>
                      Your biggest expense is{" "}
                      <span className="font-medium text-gray-800">
                        {result.biggest.label}
                      </span>{" "}
                      ({result.biggest.percentage}% of the total).
                    </li>
                    <li>
                      Adding a 10% buffer for unexpected costs, plan for about{" "}
                      <span className="font-medium text-gray-800">
                        {formatCurrency(roundMoney(result.perPersonMonthly * 1.1))}
                      </span>{" "}
                      per person each month.
                    </li>
                  </ul>
                )}

                <p className="mt-2 text-xs text-gray-500">
                  This is a simple estimate based only on the numbers you
                  entered.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default ExpenseCalculator;