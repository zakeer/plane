import useSWR from "swr";

import { useRouter } from "next/router";
import Link from "next/link";

// services
import userService from "services/user.service";
// layouts
import { WorkspaceAuthorizationLayout } from "layouts/auth-layout";
import SettingsNavbar from "layouts/settings-navbar";
// components
import { ActivityIcon, ActivityMessage } from "components/core";
import RemirrorRichTextEditor from "components/rich-text-editor";
// icons
import { ArrowTopRightOnSquareIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
// ui
import { Icon, Loader } from "components/ui";
import { BreadcrumbItem, Breadcrumbs } from "components/breadcrumbs";
// fetch-keys
import { USER_ACTIVITY } from "constants/fetch-keys";
// helper
import { timeAgo } from "helpers/date-time.helper";

const ProfileActivity = () => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { data: userActivity } = useSWR(USER_ACTIVITY, () => userService.getUserActivity());

  return (
    <WorkspaceAuthorizationLayout
      breadcrumbs={
        <Breadcrumbs>
          <BreadcrumbItem title="My Profile Activity" />
        </Breadcrumbs>
      }
    >
      <div className="p-8">
        <div className="mb-8 space-y-6">
          <div>
            <h3 className="text-3xl font-semibold">Profile Settings</h3>
            <p className="mt-1 text-custom-text-200">
              This information will be visible to only you.
            </p>
          </div>
          <SettingsNavbar profilePage />
        </div>
        {userActivity ? (
          userActivity.results.length > 0 ? (
            <div>
              <ul role="list" className="-mb-4">
                {userActivity.results.map((activityItem: any, activityIdx: number) => {
                  if (activityItem.field === "comment") {
                    return (
                      <div key={activityItem.id} className="mt-2">
                        <div className="relative flex items-start space-x-3">
                          <div className="relative px-1">
                            {activityItem.field ? (
                              activityItem.new_value === "restore" && (
                                <Icon iconName="history" className="text-sm text-custom-text-200" />
                              )
                            ) : activityItem.actor_detail.avatar &&
                              activityItem.actor_detail.avatar !== "" ? (
                              <img
                                src={activityItem.actor_detail.avatar}
                                alt={activityItem.actor_detail.display_name}
                                height={30}
                                width={30}
                                className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-gray-500 text-white"
                              />
                            ) : (
                              <div
                                className={`grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-gray-500 text-white`}
                              >
                                {activityItem.actor_detail.display_name?.charAt(0)}
                              </div>
                            )}

                            <span className="ring-6 flex h-7 w-7 items-center justify-center rounded-full bg-custom-background-80 text-custom-text-200 ring-white">
                              <ChatBubbleLeftEllipsisIcon
                                className="h-3.5 w-3.5 text-custom-text-200"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-xs">
                                {activityItem.actor_detail.is_bot
                                  ? activityItem.actor_detail.first_name + " Bot"
                                  : activityItem.actor_detail.display_name}
                              </div>
                              <p className="mt-0.5 text-xs text-custom-text-200">
                                Commented {timeAgo(activityItem.created_at)}
                              </p>
                            </div>
                            <div className="issue-comments-section p-0">
                              <RemirrorRichTextEditor
                                value={
                                  activityItem.new_value && activityItem.new_value !== ""
                                    ? activityItem.new_value
                                    : activityItem.old_value
                                }
                                editable={false}
                                noBorder
                                customClassName="text-xs border border-custom-border-200 bg-custom-background-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const message =
                    activityItem.verb === "created" &&
                    activityItem.field !== "cycles" &&
                    activityItem.field !== "modules" &&
                    activityItem.field !== "attachment" &&
                    activityItem.field !== "link" &&
                    activityItem.field !== "estimate" ? (
                      <span className="text-custom-text-200">
                        created{" "}
                        <Link
                          href={`/${workspaceSlug}/projects/${activityItem.project}/issues/${activityItem.issue}`}
                        >
                          <a className="inline-flex items-center hover:underline">
                            this issue. <ArrowTopRightOnSquareIcon className="ml-1 h-3.5 w-3.5" />
                          </a>
                        </Link>
                      </span>
                    ) : activityItem.field ? (
                      <ActivityMessage activity={activityItem} showIssue />
                    ) : (
                      "created the issue."
                    );

                  if ("field" in activityItem && activityItem.field !== "updated_by") {
                    return (
                      <li key={activityItem.id}>
                        <div className="relative pb-1">
                          {userActivity.results.length > 1 &&
                          activityIdx !== userActivity.results.length - 1 ? (
                            <span
                              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-custom-background-80"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex items-start space-x-2">
                            <>
                              <div>
                                <div className="relative px-1.5">
                                  <div className="mt-1.5">
                                    <div className="ring-6 flex h-7 w-7 items-center justify-center rounded-full bg-custom-background-80 text-custom-text-200 ring-white">
                                      {activityItem.field ? (
                                        activityItem.new_value === "restore" ? (
                                          <Icon
                                            iconName="history"
                                            className="text-sm text-custom-text-200"
                                          />
                                        ) : (
                                          <ActivityIcon activity={activityItem} />
                                        )
                                      ) : activityItem.actor_detail.avatar &&
                                        activityItem.actor_detail.avatar !== "" ? (
                                        <img
                                          src={activityItem.actor_detail.avatar}
                                          alt={activityItem.actor_detail.display_name}
                                          height={24}
                                          width={24}
                                          className="rounded-full"
                                        />
                                      ) : (
                                        <div
                                          className={`grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-gray-700 text-xs text-white`}
                                        >
                                          {activityItem.actor_detail.display_name?.charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 py-3">
                                <div className="text-xs text-custom-text-200 break-words">
                                  {activityItem.field === "archived_at" &&
                                  activityItem.new_value !== "restore" ? (
                                    <span className="text-gray font-medium">Plane</span>
                                  ) : activityItem.actor_detail.is_bot ? (
                                    <span className="text-gray font-medium">
                                      {activityItem.actor_detail.first_name} Bot
                                    </span>
                                  ) : (
                                    <Link
                                      href={`/${workspaceSlug}/profile/${activityItem.actor_detail.id}`}
                                    >
                                      <a className="text-gray font-medium">
                                        {activityItem.actor_detail.display_name}
                                      </a>
                                    </Link>
                                  )}{" "}
                                  {message}{" "}
                                  <span className="whitespace-nowrap">
                                    {timeAgo(activityItem.created_at)}
                                  </span>
                                </div>
                              </div>
                            </>
                          </div>
                        </div>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          ) : null
        ) : (
          <Loader className="space-y-5">
            <Loader.Item height="40px" />
            <Loader.Item height="40px" />
            <Loader.Item height="40px" />
            <Loader.Item height="40px" />
          </Loader>
        )}
      </div>
    </WorkspaceAuthorizationLayout>
  );
};

export default ProfileActivity;
