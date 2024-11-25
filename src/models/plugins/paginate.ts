import { Schema, Document, PopulateOptions } from "mongoose";

export interface QueryOptions {
  sortBy?: string; // e.g., "field1:asc,field2:desc"
  populate?: string; // e.g., "field1,field2.nestedField"
  limit?: number;
  page?: number;
}

export interface QueryResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

function paginate<T extends Document>(schema: Schema<T>) {
  schema.statics.paginate = async function (
    filter: Record<string, any> = {},
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    let sort = "";

    if (options.sortBy) {
      const sortingCriteria = options.sortBy.split(",").map((sortOption) => {
        const [key, order] = sortOption.split(":");
        return `${order === "desc" ? "-" : ""}${key}`;
      });
      if (!sortingCriteria.includes("updatedAt")) {
        sortingCriteria.unshift("-updatedAt");
      }
      sort = sortingCriteria.join(" ");
    } else {
      sort = "-updatedAt"; // Default sort
    }

    const limit = Math.max(1, options.limit || 10); // Ensure a positive limit
    const page = Math.max(1, options.page || 1); // Ensure a positive page number
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(",").forEach((populateOption) => {
        const populateConfig: PopulateOptions = {
          path: populateOption.split(".")[0],
          populate: populateOption
            .split(".")
            .slice(1)
            .reduceRight<PopulateOptions | undefined>(
              (prev, curr) =>
                prev ? { path: curr, populate: prev } : { path: curr },
              undefined // Initial value for reduceRight
            ),
        };
        docsPromise = docsPromise.populate(populateConfig);
      });
    }

    const [totalResults, results] = await Promise.all([
      countPromise,
      docsPromise.exec(),
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  };
}

export default paginate;
