import { Schema, Document } from "mongoose";

const deleteAtPath = (
  obj: Record<string, any>,
  path: string[],
  index: number
) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  if (obj[path[index]]) {
    deleteAtPath(obj[path[index]], path, index + 1);
  }
};

function toJSON<T>(schema: Schema<T>) {
  // Cast schema to `Schema & { options: any }` to access `options`
  const schemaWithOptions = schema as Schema & { options: Record<string, any> };

  const originalTransform = schemaWithOptions.options.toJSON?.transform;

  schemaWithOptions.options.toJSON = {
    ...schemaWithOptions.options.toJSON,
    transform(
      doc: Document,
      ret: Record<string, any>,
      options: any
    ): Record<string, any> {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options?.private) {
          deleteAtPath(ret, path.split("."), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;

      if (originalTransform) {
        return originalTransform(doc, ret, options);
      }

      return ret;
    },
  };
}

export default toJSON;
