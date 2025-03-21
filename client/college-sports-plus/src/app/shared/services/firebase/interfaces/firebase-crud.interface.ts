export interface FirebaseCrud<TDataModel> {
  //   unsubscribe: Subject<void>;

  initialize(): void;

  addEntity(model: TDataModel): void;

  addEntityNeedsID(model: TDataModel): void;

  deleteEntity(model: TDataModel): void;

  updateEntity(model: TDataModel): void;
}
