import { auth } from "../../auth";
import { TransactionsClient } from "../../components/transactions-client";
import { getTransactionsByUserId } from "../../repositories/transaction.repository";

export default async function TransactionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div className="p-10">Unauthorized</div>;
  }

  const transactions =
    (await getTransactionsByUserId(session.user.id)) || [];

  return <TransactionsClient initialTransactions={transactions} />;
}