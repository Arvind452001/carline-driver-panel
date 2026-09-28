import { Star, MessageSquare, ThumbsUp, Award, CalendarDays } from 'lucide-react';

export function RatingPage() {
  const reviews = [
    {
      passenger: 'Rahul',
      rating: 5,
      comment: 'Great ride!',
      date: '2026-08-19',
    },
    {
      passenger: 'Priya',
      rating: 4,
      comment: 'Good experience.',
      date: '2026-08-18',
    },
    {
      passenger: 'Amit',
      rating: 5,
      comment: 'On time, polite driver.',
      date: '2026-08-17',
    },
  ];

  const ratingData = [
    { stars: 5, percentage: 85, count: 265 },
    { stars: 4, percentage: 10, count: 31 },
    { stars: 3, percentage: 3, count: 9 },
    { stars: 2, percentage: 1, count: 4 },
    { stars: 1, percentage: 1, count: 3 },
  ];

  return (
    <div className="space-y-6 pb-6">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary-500 mb-1">
          Driver Performance
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
          Ratings & Reviews
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          See what passengers are saying about your service.
        </p>
      </div>

      {/* Rating Overview */}
      <div
        className="
          relative overflow-hidden
          bg-white
          rounded-2xl
          border border-gray-100
          shadow-[0_4px_20px_rgba(0,0,0,0.04)]
        "
      >
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-amber-50/70" />
        <div className="absolute -left-20 -bottom-20 w-44 h-44 rounded-full bg-orange-50/40" />

        <div className="relative p-6 sm:p-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

            {/* Overall Rating */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-start gap-5">

              <div className="text-center sm:text-left lg:text-left">
                <p className="text-sm font-medium text-gray-500">
                  Overall Rating
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-5xl sm:text-6xl font-bold text-navy tracking-tight">
                    4.8
                  </span>

                  <div className="flex flex-col">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>

                    <span className="text-xs text-gray-400 mt-1">
                      Based on 312 ratings
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-bold">
                    Excellent
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Rating Distribution
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Passenger rating breakdown
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  312 ratings
                </div>
              </div>

              <div className="space-y-3">
                {ratingData.map((item) => (
                  <div
                    key={item.stars}
                    className="flex items-center gap-3"
                  >
                    {/* Stars */}
                    <div className="w-10 flex items-center gap-1">
                      <span className="text-sm font-semibold text-gray-700">
                        {item.stars}
                      </span>

                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </div>

                    {/* Progress */}
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>

                    {/* Percentage */}
                    <span className="w-10 text-right text-xs font-semibold text-gray-500">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Small Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Excellent */}
        <div
          className="
            bg-white rounded-2xl
            border border-gray-100
            p-5
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
            hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]
            transition-all duration-300
          "
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                5-Star Ratings
              </p>

              <p className="text-xl font-bold text-navy">
                265
              </p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div
          className="
            bg-white rounded-2xl
            border border-gray-100
            p-5
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
            hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]
            transition-all duration-300
          "
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Total Reviews
              </p>

              <p className="text-xl font-bold text-navy">
                312
              </p>
            </div>
          </div>
        </div>

        {/* Positive */}
        <div
          className="
            bg-white rounded-2xl
            border border-gray-100
            p-5
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
            hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]
            transition-all duration-300
          "
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Positive Ratings
              </p>

              <p className="text-xl font-bold text-navy">
                95%
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Reviews */}
      <div
        className="
          bg-white
          rounded-2xl
          border border-gray-100
          shadow-[0_4px_20px_rgba(0,0,0,0.04)]
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">
                Recent Reviews
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Feedback from your recent passengers
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="divide-y divide-gray-100">
          {reviews.map((review, index) => (
            <div
              key={`${review.passenger}-${index}`}
              className="
                p-5 sm:p-6
                hover:bg-gray-50/70
                transition-colors duration-200
              "
            >
              <div className="flex gap-4">

                {/* Avatar */}
                <div
                  className="
                    w-11 h-11
                    rounded-full
                    bg-gradient-to-br from-primary-100 to-primary-50
                    flex items-center justify-center
                    shrink-0
                  "
                >
                  <span className="text-sm font-bold text-primary-600">
                    {review.passenger.charAt(0)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {review.passenger}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`
                                w-3.5 h-3.5
                                ${
                                  star <= review.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-200'
                                }
                              `}
                            />
                          ))}
                        </div>

                        <span className="text-xs font-semibold text-gray-500">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {review.date}
                    </div>
                  </div>

                  <div className="mt-3 bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 bg-gray-50/60 border-t border-gray-100">
          <button
            className="
              text-sm font-semibold
              text-primary-500
              hover:text-primary-600
              transition-colors
            "
          >
            View all reviews →
          </button>
        </div>
      </div>
    </div>
  );
}